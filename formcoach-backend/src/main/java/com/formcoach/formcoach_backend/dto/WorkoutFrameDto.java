package com.formcoach.formcoach_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

// data received from client
@Data
@NoArgsConstructor
public class WorkoutFrameDto {
    private String exerciseId;  // e.g. bicep-curl, shoulder-press
    private String frameData; // stored as Base-64 encoded images
    private String sessionId; // for microservice to keep track of reps in session
}
