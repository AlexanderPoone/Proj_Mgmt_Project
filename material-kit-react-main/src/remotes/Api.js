import axios from "axios";
import ConfigData from "../config.json";

export const githubAPI = axios.create({
    baseURL: ConfigData.GITHUB_API_ENDPOINT,
    timeout: 5000
});

const fetchGithubUser = () => githubAPI.get('/user');

// const githubLogin = () => axiosInstance.get(`${configData.SEVER_ROOT}/github/authorize`);

export default {fetchGithubUser};