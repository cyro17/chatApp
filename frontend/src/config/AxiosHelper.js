import axios from "axios";

export const baseURL = "http://localhost:9090";

export const api = axios.create({
    baseURL,
})
