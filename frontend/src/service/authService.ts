import axiosInstance from "@/api/axiosInstance";

export const signup = (email: string, password: string) => 
    axiosInstance.post('/v1/auth/signup', {email, password});

export const login = (email: string, password: string) => 
    axiosInstance.post('/v1/auth/login', {email, password});