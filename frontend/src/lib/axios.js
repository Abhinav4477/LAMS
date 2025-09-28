import axios from "axios";

const api= axios.create({
    baseURL:"http://localhost:5001/api"
})
export const API_BASE_URL = "http://localhost:5001";

export default api;
