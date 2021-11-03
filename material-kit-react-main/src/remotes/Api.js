import axios from "axios";
import configData from "../config.json";

export const axiosInstance = axios.create({
    timeout: 5000
});

// const githubAuthorize = () => axiosInstance.get(`${configData.SEVER_ROOT}/github/authorize`,
//     {
//         'client_id': configData.GITHUB_CLIENTID,
//         'redirect_uri': configData.REDIRECT_URI,
//         'allow_signup': false
//     });

// const githubLogin = () => axiosInstance.get(`${configData.SEVER_ROOT}/github/authorize`);

export default { };