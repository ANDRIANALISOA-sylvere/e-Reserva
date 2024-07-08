import axios from "axios";

const instance = axios.create({
  baseURL: "http://192.168.43.65:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
