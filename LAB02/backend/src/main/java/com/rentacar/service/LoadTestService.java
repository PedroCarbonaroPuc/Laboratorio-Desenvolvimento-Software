package com.rentacar.service;

import com.rentacar.dto.loadtest.LoadTestEvent;
import com.rentacar.dto.loadtest.LoadTestRequest;
import com.rentacar.dto.loadtest.LoadTestResult;
import com.rentacar.repository.RentalOrderRepository;
import com.rentacar.repository.VehicleRepository;
import io.micronaut.http.sse.Event;
import jakarta.inject.Singleton;
import reactor.core.publisher.Flux;
import reactor.core.publisher.FluxSink;
import reactor.core.publisher.Mono;

import java.lang.management.ManagementFactory;
import java.lang.management.ThreadMXBean;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;

@Singleton
public class LoadTestService {

    private final VehicleRepository vehicleRepository;
    private final RentalOrderRepository rentalOrderRepository;
    private final com.mongodb.reactivestreams.client.MongoClient reactiveMongoClient;

    public LoadTestService(
            VehicleRepository vehicleRepository,
            RentalOrderRepository rentalOrderRepository,
            com.mongodb.reactivestreams.client.MongoClient reactiveMongoClient) {
        this.vehicleRepository = vehicleRepository;
        this.rentalOrderRepository = rentalOrderRepository;
        this.reactiveMongoClient = reactiveMongoClient;
    }

    public Flux<Event<LoadTestEvent>> executeTest(LoadTestRequest request) {
        return Flux.create(sink -> {
            CompletableFuture.runAsync(() -> {
                try {
                    sendEvent(sink, LoadTestEvent.builder()
                            .type("progress").architecture("MICRONAUT_SYNC")
                            .completedRequests(0).totalRequests(request.getTotalRequests())
                            .message("Iniciando teste com Micronaut Sync (Bloqueante)...")
                            .build());

                    LoadTestResult syncResult = runBlockingTest(request, sink);
                    sendEvent(sink, LoadTestEvent.builder()
                            .type("result").architecture("MICRONAUT_SYNC")
                            .result(syncResult)
                            .completedRequests(request.getTotalRequests())
                            .totalRequests(request.getTotalRequests())
                            .message("Teste Micronaut Sync concluído")
                            .build());

                    Thread.sleep(500);

                    sendEvent(sink, LoadTestEvent.builder()
                            .type("progress").architecture("MICRONAUT_REACTIVE")
                            .completedRequests(0).totalRequests(request.getTotalRequests())
                            .message("Iniciando teste com Micronaut Reactive (Reativo)...")
                            .build());

                    LoadTestResult reactiveResult = runReactiveTest(request, sink);
                    sendEvent(sink, LoadTestEvent.builder()
                            .type("result").architecture("MICRONAUT_REACTIVE")
                            .result(reactiveResult)
                            .completedRequests(request.getTotalRequests())
                            .totalRequests(request.getTotalRequests())
                            .message("Teste Micronaut Reactive concluído")
                            .build());

                    sendEvent(sink, LoadTestEvent.builder()
                            .type("complete").message("Todos os testes concluídos")
                            .build());

                    sink.complete();
                } catch (Exception e) {
                    try {
                        sendEvent(sink, LoadTestEvent.builder()
                                .type("error").message("Erro: " + e.getMessage())
                                .build());
                        sink.complete();
                    } catch (Exception ignored) {}
                }
            });
        });
    }

    private LoadTestResult runBlockingTest(LoadTestRequest request, FluxSink<Event<LoadTestEvent>> sink) throws Exception {

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
                            sendEvent(sink, LoadTestEvent.builder()
                                    .type("progress").architecture("MICRONAUT_SYNC")
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

        return buildResult("MICRONAUT_SYNC", testType, total, errors.get(),
                totalTime, latencies, peakThreads.get(),
                Math.max(0, (memAfter - memBefore) / (1024 * 1024)));
    }

    private LoadTestResult runReactiveTest(LoadTestRequest request, FluxSink<Event<LoadTestEvent>> sink) {

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
                                        sendEvent(sink, LoadTestEvent.builder()
                                                .type("progress").architecture("MICRONAUT_REACTIVE")
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

        return buildResult("MICRONAUT_REACTIVE", testType, total, errors.get(),
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
        var db = reactiveMongoClient.getDatabase("rentacar");
        return switch (testType) {
            case "database_read" ->
                    Flux.from(db.getCollection("vehicles").find()).collectList()
                            .then(Flux.from(db.getCollection("rental_orders").find()).collectList())
                            .then();
            case "io_simulation" ->
                    Mono.delay(Duration.ofMillis(ioDelay)).then();
            case "concurrent_load" ->
                    Flux.from(db.getCollection("vehicles").find()).collectList()
                            .then(Flux.from(db.getCollection("rental_orders").find()).collectList())
                            .then(Mono.delay(Duration.ofMillis(10)))
                            .then();
            case "mixed_workload" ->
                    Flux.from(db.getCollection("vehicles").find()).collectList()
                            .then(Mono.delay(Duration.ofMillis(ioDelay > 0 ? ioDelay : 50)))
                            .then(Mono.from(db.getCollection("rental_orders").countDocuments()))
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

    private void sendEvent(FluxSink<Event<LoadTestEvent>> sink, LoadTestEvent event) {
        sink.next(Event.of(event));
    }
}
