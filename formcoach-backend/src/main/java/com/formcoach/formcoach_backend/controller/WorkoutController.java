package com.formcoach.formcoach_backend.controller;

import com.formcoach.formcoach_backend.dto.WorkoutFrameDto;
import com.formcoach.formcoach_backend.responses.WorkoutDataResponse;
import com.formcoach.formcoach_backend.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;

@Controller
public class WorkoutController {

    private final WorkoutService workoutService;

    @Autowired
    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }


    /**
     * Receive frames from client and send detection results back
     * Note these are not Urls they are STOMP destinations, paths where client or server listens
     * @MessageMapping: Client sends frames /app/workout this controller
     * @SendTo: Server sends response to /topic/workout which clients subscribe to
     */
    @MessageMapping("/workout")
    @SendTo("/topic/workout")
    public WorkoutDataResponse processWorkout(WorkoutFrameDto frame) {
        if (frame.getUserId() == null || frame.getUserId().isEmpty()) {
            frame.setUserId("anonymous");
        }

        return this.workoutService.analyzeFrames(frame);
    }
}
