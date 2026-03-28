package com.rentacar.service;

import com.rentacar.dto.loadtest.LoadTestEvent;
import com.rentacar.dto.loadtest.LoadTestRequest;
import com.rentacar.dto.loadtest.LoadTestResult;
import com.rentacar.repository.RentalOrderRepository;
import com.rentacar.repository.VehicleRepository;
import com.rentacar.repository.reactive.ReactiveRentalOrderRepository;
import com.rentacar.repository.reactive.ReactiveVehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;
import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.lang.management.ThreadMXBean;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class LoadTestService {

    private final VehicleRepository vehicleRepository;
    private final RentalOrderRepository rentalOrderRepository;
    private final ReactiveVehicleRepository reactiveVehicleRepository;
    private final ReactiveRentalOrderRepository reactiveRentalOrderRepository;

    public LoadTestService(
            VehicleRepository vehicleRepository,
            RentalOrderRepository rentalOrderRepository,
            ReactiveVehicleRepository reactiveVehicleRepository,
            ReactiveRentalOrderRepository reactiveRentalOrderRepository) {
        this.vehicleRepository = vehicleRepository;
        this.rentalOrderRepository = rentalOrderRepository;
        this.reactiveVehicleRepository = reactiveVehicleRepository;
        this.reactiveRentalOrderRepository = reactiveRentalOrderRepository;
    }

    public void executeTest(LoadTestRequest request, SseEmitter emitter) {
        CompletableFuture.runAsync(() -> {
            try {
                sendEvent(emitter, LoadTestEvent.builder()
                        .type("progress").architecture("SPRING_MVC")
                        .completedRequests(0).totalRequests(request.getTotalRequests())
                        .message("Iniciando teste com Spring MVC (Bloqueante)...")
                        .build());

                LoadTestResult mvcResult = runBlockingTest(request, emitter);
                sendEvent(emitter, LoadTestEvent.builder()
                        .type("result").architecture("SPRING_MVC")
                        .result(mvcResult)
                        .completedRequests(request.getTotalRequests())
                        .totalRequests(request.getTotalRequests())
                        .message("Teste Spring MVC concluído")
                        .build());

                Thread.sleep(500);

                sendEvent(emitter, LoadTestEvent.builder()
                        .type("progress").architecture("SPRING_WEBFLUX")
                        .completedRequests(0).totalRequests(request.getTotalRequests())
                        .message("Iniciando teste com Spring WebFlux (Reativo)...")
                        .build());

                LoadTestResult webfluxResult = runReactiveTest(request, emitter);
                sendEvent(emitter, LoadTestEvent.builder()
                        .type("result").architecture("SPRING_WEBFLUX")
                        .result(webfluxResult)
                        .completedRequests(request.getTotalRequests())
                        .totalRequests(request.getTotalRequests())
                        .message("Teste Spring WebFlux concluído")
                        .build());

                sendEvent(emitter, LoadTestEvent.builder()
                        .type("complete").message("Todos os testes concluídos")
                        .build());

                emitter.complete();
            } catch (Exception e) {
                try {
                    sendEvent(emitter, LoadTestEvent.builder()
                            .type("error").message("Erro: " + e.getMessage())
                            .build());
                    emitter.complete();
                } catch (Exception ignored) {}
            }
        });
    }

    private LoadTestResult runBlockingTest(LoadTestRequest request, SseEmitter emitter) throws Exception {
        int total = request.getTotalRequests();
        int concurrency = request.getConcurrencyLevel();
        String testType = request.getTestType();
        int ioDelay = request.getIoDelayMs();

        ExecutorService executor = Executors.newFixedThreadPool(concurrency);
        List<Long> latencies = Collections.synchronizedList(new ArrayList<>(total));
        AtomicInteger completed = new AtomicInteger(0);
        AtomicInteger errors = new AtomicInteger(0);
        AtomicInteger peakThreads = new AtomicInteger(0);

        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();

        Runtime runtime = Runtime.getRuntime();
        runtime.gc();
        long memBefore = runtime.totalMemory() - runtime.freeMemory();

        long startTime = System.nanoTime();
        List<Future<?>> futures = new ArrayList<>(total);

        for (int i = 0; i < total; i++) {
            futures.add(executor.submit(() -> {
                long opStart = System.nanoTime();
                try {
                    int currentThreads = threadBean.getThreadCount();
                    peakThreads.updateAndGet(prev -> Math.max(prev, currentThreads));

                    executeBlockingOperation(testType, ioDelay);

                    long elapsed = (System.nanoTime() - opStart) / 1_000_000;
                    latencies.add(elapsed);
                } catch (Exception e) {
                    errors.incrementAndGet();
                } finally {
                    int done = completed.incrementAndGet();
                    if (done % Math.max(1, total / 20) == 0 || done == total) {
                        try {
                            double avg = latencies.isEmpty() ? 0 :
                                    latencies.stream().mapToLong(Long::longValue).average().orElse(0);
                            sendEvent(emitter, LoadTestEvent.builder()
                                    .type("progress").architecture("SPRING_MVC")
                                    .completedRequests(done).totalRequests(total)
                                    .currentAvgMs(Math.round(avg * 100.0) / 100.0)
                                    .build());
                        } catch (Exception ignored) {}
                    }
                }
            }));
        }

        for (Future<?> f : futures) {
            f.get(120, TimeUnit.SECONDS);
        }

        long totalTime = (System.nanoTime() - startTime) / 1_000_000;
        long memAfter = runtime.totalMemory() - runtime.freeMemory();
        executor.shutdown();

        return buildResult("SPRING_MVC", testType, total, errors.get(),
                totalTime, latencies, peakThreads.get(),
                Math.max(0, (memAfter - memBefore) / (1024 * 1024)));
    }

    private LoadTestResult runReactiveTest(LoadTestRequest request, SseEmitter emitter) throws Exception {
        int total = request.getTotalRequests();
        int concurrency = request.getConcurrencyLevel();
        String testType = request.getTestType();
        int ioDelay = request.getIoDelayMs();

        List<Long> latencies = Collections.synchronizedList(new ArrayList<>(total));
        AtomicInteger completed = new AtomicInteger(0);
        AtomicInteger errors = new AtomicInteger(0);
        AtomicInteger peakThreads = new AtomicInteger(0);

        ThreadMXBean threadBean = ManagementFactory.getThreadMXBean();

        Runtime runtime = Runtime.getRuntime();
        runtime.gc();
        long memBefore = runtime.totalMemory() - runtime.freeMemory();

        long startTime = System.nanoTime();

        Flux.range(0, total)
                .flatMap(i -> {
                    long opStart = System.nanoTime();
                    int currentThreads = threadBean.getThreadCount();
                    peakThreads.updateAndGet(prev -> Math.max(prev, currentThreads));

                    return executeReactiveOperation(testType, ioDelay)
                            .doOnSuccess(v -> {
                                long elapsed = (System.nanoTime() - opStart) / 1_000_000;
                                latencies.add(elapsed);
                                int done = completed.incrementAndGet();
                                if (done % Math.max(1, total / 20) == 0 || done == total) {
                                    try {
                                        double avg = latencies.isEmpty() ? 0 :
                                                latencies.stream().mapToLong(Long::longValue).average().orElse(0);
                                        sendEvent(emitter, LoadTestEvent.builder()
                                                .type("progress").architecture("SPRING_WEBFLUX")
                                                .completedRequests(done).totalRequests(total)
                                                .currentAvgMs(Math.round(avg * 100.0) / 100.0)
                                                .build());
                                    } catch (Exception ignored) {}
                                }
                            })
                            .doOnError(e -> errors.incrementAndGet())
                            .onErrorResume(e -> Mono.empty());
                }, concurrency)
                .then()
                .block(Duration.ofSeconds(120));

        long totalTime = (System.nanoTime() - startTime) / 1_000_000;
        long memAfter = runtime.totalMemory() - runtime.freeMemory();

        return buildResult("SPRING_WEBFLUX", testType, total, errors.get(),
                totalTime, latencies, peakThreads.get(),
                Math.max(0, (memAfter - memBefore) / (1024 * 1024)));
    }

    private void executeBlockingOperation(String testType, int ioDelay) {
        switch (testType) {
            case "database_read" -> {
                vehicleRepository.findAll();
                rentalOrderRepository.findAll();
            }
            case "io_simulation" -> {
                try {
                    Thread.sleep(ioDelay);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
            case "concurrent_load" -> {
                vehicleRepository.findAll();
                rentalOrderRepository.findAll();
                try {
                    Thread.sleep(10);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
            case "mixed_workload" -> {
                vehicleRepository.findAll();
                try {
                    Thread.sleep(ioDelay > 0 ? ioDelay : 50);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                rentalOrderRepository.count();
                double sum = 0;
                for (int j = 0; j < 10000; j++) {
                    sum += Math.sqrt(j) * Math.sin(j);
                }
            }
            default -> throw new IllegalArgumentException("Unknown test type: " + testType);
        }
    }

    private Mono<Void> executeReactiveOperation(String testType, int ioDelay) {
        return switch (testType) {
            case "database_read" ->
                    reactiveVehicleRepository.findAll().collectList()
                            .then(reactiveRentalOrderRepository.findAll().collectList())
                            .then();
            case "io_simulation" ->
                    Mono.delay(Duration.ofMillis(ioDelay)).then();
            case "concurrent_load" ->
                    reactiveVehicleRepository.findAll().collectList()
                            .then(reactiveRentalOrderRepository.findAll().collectList())
                            .then(Mono.delay(Duration.ofMillis(10)))
                            .then();
            case "mixed_workload" ->
                    reactiveVehicleRepository.findAll().collectList()
                            .then(Mono.delay(Duration.ofMillis(ioDelay > 0 ? ioDelay : 50)))
                            .then(reactiveRentalOrderRepository.count())
                            .map(count -> {
                                double sum = 0;
                                for (int j = 0; j < 10000; j++) {
                                    sum += Math.sqrt(j) * Math.sin(j);
                                }
                                return count;
                            })
                            .then();
            default -> Mono.error(new IllegalArgumentException("Unknown test type: " + testType));
        };
    }

    private LoadTestResult buildResult(String architecture, String testType, int totalRequests,
                                       int errorCount, long totalTimeMs, List<Long> latencies,
                                       int peakThreads, long memoryUsedMb) {
        if (latencies.isEmpty()) {
            return LoadTestResult.builder()
                    .architecture(architecture).testType(testType)
                    .totalRequests(totalRequests).successCount(0).errorCount(errorCount)
                    .totalTimeMs(totalTimeMs)
                    .build();
        }

        List<Long> sorted = new ArrayList<>(latencies);
        Collections.sort(sorted);

        double avg = sorted.stream().mapToLong(Long::longValue).average().orElse(0);
        long min = sorted.get(0);
        long max = sorted.get(sorted.size() - 1);
        double p50 = percentile(sorted, 50);
        double p95 = percentile(sorted, 95);
        double p99 = percentile(sorted, 99);
        double throughput = totalTimeMs > 0 ? (double) sorted.size() / totalTimeMs * 1000 : 0;

        return LoadTestResult.builder()
                .architecture(architecture)
                .testType(testType)
                .totalRequests(totalRequests)
                .successCount(sorted.size())
                .errorCount(errorCount)
                .totalTimeMs(totalTimeMs)
                .avgResponseTimeMs(Math.round(avg * 100.0) / 100.0)
                .minResponseTimeMs(min)
                .maxResponseTimeMs(max)
                .p50Ms(Math.round(p50 * 100.0) / 100.0)
                .p95Ms(Math.round(p95 * 100.0) / 100.0)
                .p99Ms(Math.round(p99 * 100.0) / 100.0)
                .throughputReqPerSec(Math.round(throughput * 100.0) / 100.0)
                .peakThreadCount(peakThreads)
                .memoryUsedMb(memoryUsedMb)
                .build();
    }

    private double percentile(List<Long> sortedLatencies, double percentile) {
        if (sortedLatencies.isEmpty()) return 0;
        int index = (int) Math.ceil(percentile / 100.0 * sortedLatencies.size()) - 1;
        index = Math.max(0, Math.min(index, sortedLatencies.size() - 1));
        return sortedLatencies.get(index);
    }

    private void sendEvent(SseEmitter emitter, LoadTestEvent event) {
        try {
            emitter.send(SseEmitter.event().data(event));
        } catch (IOException ignored) {}
    }
}
