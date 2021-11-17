import axios from "axios";
import ConfigData from "../config.json";

export const githubAPI = axios.create({
    baseURL: ConfigData.GITHUB_API_ENDPOINT,
    timeout: 5000
});

export const API = axios.create({
    baseURL: ConfigData.API_ENDPOINT,
    timeout: 5000
});

//Github API
const fetchGithubUser = () => githubAPI.get('/user');

const fetchGithubUserRepos = () => githubAPI.get('/user/repos');

const fetchGithubUserRepo = () => githubAPI.get(`/user/repos/${props.repoFullName}`);

const fetchGithubUserRepoIssues = (props) => githubAPI.get(`/repos/${props.repoFullName}/issues`, {params: props.params});

const fetchGithubUserRepoIssue = (props) => githubAPI.get(`/repos/${props.repoFullName}/issues/${props.issueNum}`);

const fetchGithubUserRepoMilestones = (props) => githubAPI.get(`/repos/${props.repoFullName}/milestones`, {params: props.params});

const fetchGithubUserRepoMilestone = (props) => githubAPI.get(`/repos/${props.repoFullName}/milestones/${props.mileStoneNum}`);

const fetchGithubUserMileStoneIssues = (props) => githubAPI.get(`/repos/${props.repoFullName}/issues`, {params: props.params});

//API
const fetchRepo = (props) => API.get(`/repo/${props.owner}/${props.reponame}`);
const fetchContributors = (props) => API.get(`/contributors/${props.owner}/${props.reponame}`);
const fetchMyInfo = (props) => API.get(`/me}`);
const assignTeam = (props) => API.get(`/assignTeam/${props.owner}/${props.reponame}/${props.collaborator}/${props.role}`);
const confirmIssue = (props) => API.get(`/confirm/${props.owner}/${props.reponame}/${props.issueNum}/${props.assignee}/${props.startDate}/${props.numdays}`);
const rejectIssue = (props) => API.get(`/reject/${props.owner}/${props.reponame}/${props.issueNum}`);
const resolveIssue = (props) => API.get(`/resolve/${props.owner}/${props.reponame}/${props.issueNum}/${props.pullReqNum}`);
const delayIssue = (props) => API.get(`/delay/${props.owner}/${props.reponame}/${props.issueNum}/${props.delaydays}`);
const initialLabel = (props) => API.get(`/initial/label/${props.owner}/${props.reponame}`);
const fetchBurnDownChart = (props) => API.get(`/test/generateBurnDownChart`);
const reassignIssue = (props) => API.get(`/reassign/${props.owner}/${props.reponame}/${props.issueNum}/${props.correctCat}/${props.currentProposed}`);


export default {
    fetchGithubUser, 
    fetchGithubUserRepos,
    fetchGithubUserRepo,
    fetchGithubUserRepoIssues,
    fetchGithubUserRepoIssue,
    fetchGithubUserRepoMilestones,
    fetchGithubUserRepoMilestone,
    fetchGithubUserMileStoneIssues,
    //API
    fetchRepo,
    fetchContributors,
    fetchMyInfo,
    assignTeam,
    confirmIssue,
    rejectIssue,
    resolveIssue,
    delayIssue,
    initialLabel,
    fetchBurnDownChart,
    reassignIssue
};