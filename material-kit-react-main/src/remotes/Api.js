import axios from "axios";
import ConfigData from "../config.json";

export const githubAPI = axios.create({
    baseURL: ConfigData.GITHUB_API_ENDPOINT,
    timeout: 5000
});

const fetchGithubUser = () => githubAPI.get('/user');

const fetchGithubUserRepos = () => githubAPI.get('/user/repos');

const fetchGithubUserRepo = () => githubAPI.get(`/user/repos/${props.repoFullName}`);

const fetchGithubUserRepoIssues = (props) => githubAPI.get(`/repos/${props.repoFullName}/issues`, {params: props.params});

const fetchGithubUserRepoIssue = (props) => githubAPI.get(`/repos/${props.repoFullName}/issues/${props.issueNum}`);

const fetchGithubUserRepoMilestones = (props) => githubAPI.get(`/repos/${props.repoFullName}/milestones`, {params: props.params});

const fetchGithubUserRepoMilestone = (props) => githubAPI.get(`/repos/${props.repoFullName}/milestones/${props.mileStoneNum}`);

const fetchGithubUserMileStoneIssues = (props) => githubAPI.get(`/repos/${props.repoFullName}/issues`, {params: props.params});


// const githubLogin = () => axiosInstance.get(`${configData.SEVER_ROOT}/github/authorize`);

export default {
    fetchGithubUser, 
    fetchGithubUserRepos,
    fetchGithubUserRepo,
    fetchGithubUserRepoIssues,
    fetchGithubUserRepoIssue,
    fetchGithubUserRepoMilestones,
    fetchGithubUserRepoMilestone,
    fetchGithubUserMileStoneIssues
};