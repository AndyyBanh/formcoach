package com.formcoach.formcoach_backend.responses;

import lombok.Data;
import lombok.NoArgsConstructor;

// data received from python microservice
@Data
@NoArgsConstructor
public class WorkoutDataResponse {

    private int reps;
    private double angle;
    private String feedback;

}
