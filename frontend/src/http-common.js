import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    timeout: 50000,
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",        
    }
});
