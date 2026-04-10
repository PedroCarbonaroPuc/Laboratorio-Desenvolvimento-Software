package com.rentacar.controller;

import com.rentacar.dto.loadtest.LoadTestEvent;
import com.rentacar.dto.loadtest.LoadTestRequest;
import com.rentacar.service.LoadTestService;
import io.micronaut.http.MediaType;
import io.micronaut.http.annotation.Body;
import io.micronaut.http.annotation.Controller;
import io.micronaut.http.annotation.Post;
import io.micronaut.http.sse.Event;
import io.micronaut.security.annotation.Secured;
import org.reactivestreams.Publisher;

@Controller("/api/load-tests")
@Secured({"ADMIN"})
public class LoadTestController {

    private final LoadTestService loadTestService;

    public LoadTestController(LoadTestService loadTestService) {
        this.loadTestService = loadTestService;
    }

    @Post(value = "/run", produces = MediaType.TEXT_EVENT_STREAM)
    public Publisher<Event<LoadTestEvent>> runTest(@Body LoadTestRequest request) {
        return loadTestService.executeTest(request);
    }
}
