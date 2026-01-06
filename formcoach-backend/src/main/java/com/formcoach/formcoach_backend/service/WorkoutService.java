package com.formcoach.formcoach_backend.service;

import com.formcoach.formcoach_backend.dto.WorkoutFrameDto;
import com.formcoach.formcoach_backend.expections.PythonServiceException;
import com.formcoach.formcoach_backend.responses.WorkoutDataResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class WorkoutService {

    private final RestTemplate restTemplate = new RestTemplate();
    private static final String PYTHON_SERVICE_URL = "http://localhost:5000/analyze";

    /**
     * Propagate websocket data to make api call to python microservice
     * @param frame: sends workoutId and frames
     * @return Workout: response data: reps, angle, feedback
     */
    public WorkoutDataResponse analyzeFrames(WorkoutFrameDto frame) {
        try {

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // create request entity will auto serialize dto to JSON
            HttpEntity<WorkoutFrameDto> requestEntity = new HttpEntity<>(frame, headers);

            // Send POST Request to python
            ResponseEntity<WorkoutDataResponse> responseEntity = restTemplate.postForEntity(
                    PYTHON_SERVICE_URL,
                    requestEntity,
                    WorkoutDataResponse.class
            );

            WorkoutDataResponse response = responseEntity.getBody();

            if (response == null) {
                throw new  PythonServiceException("Response is null");
            }

            return response;

        } catch (Exception error) {
            throw new PythonServiceException("Unexpected error with Python service: " +  error.getMessage(), error);
        }
    }
}
