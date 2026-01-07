package com.formcoach.formcoach_backend.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

// data received from client
@Data
@NoArgsConstructor
public class WorkoutFrameDto {
    private String exerciseId;
    private String frameData; // stored as Base-64 encoded images
    private String userId;
}
