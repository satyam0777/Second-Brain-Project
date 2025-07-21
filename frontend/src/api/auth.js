
import API from "./axios";

export const loginUser = (payload) => API.post("/auth/login", payload);
export const signupUser = (payload) => API.post("/auth/signup", payload);
