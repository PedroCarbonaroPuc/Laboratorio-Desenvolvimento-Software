package com.rentacar.controller;

import com.rentacar.dto.loadtest.LoadTestRequest;
import com.rentacar.service.LoadTestService;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/load-tests")
@PreAuthorize("hasRole('ADMIN')")
public class LoadTestController {

    private final LoadTestService loadTestService;

    public LoadTestController(LoadTestService loadTestService) {
        this.loadTestService = loadTestService;
    }

    @PostMapping(value = "/run", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter runTest(@RequestBody LoadTestRequest request) {
        // 5 minute timeout
        SseEmitter emitter = new SseEmitter(300_000L);

        emitter.onCompletion(() -> {});
        emitter.onTimeout(emitter::complete);
        emitter.onError(e -> emitter.complete());

        loadTestService.executeTest(request, emitter);

        return emitter;
    }
}
