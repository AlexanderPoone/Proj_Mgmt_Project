import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import IssueListToolbar from '../components/issue/IssueListToolbar';
import IssueListResults from 'src/components/issue/IssueListResults';
import customers from 'src/__mocks__/customers';
import { fetchGithubUserRepoIssuesAsync, issueProducts } from 'src/reducers/IssueReducer';
import { store } from 'src/store';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchRepoAsync, reposProducts } from 'src/reducers/RepoReducer';
import { milestoneProducts } from 'src/reducers/MileStoneReducer';
import { useNavigate } from 'react-router-dom/umd/react-router-dom.development';

const IssueList = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const repo = reposProducts(store.getState()).repo;
  const mileStone = milestoneProducts(store.getState()).milestone;
  // const issue = issueProducts(store.getState());
  const repoInfo = reposProducts(store.getState()).repoInfo;

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  useEffect(() => {
    // dispatch(fetchGithubUserRepoIssuesAsync({ repoFullName: repo.repo.full_name, params: { mileStone: mileStone.number } }))
    dispatch(fetchRepoAsync({ owner: repo?.owner?.login, reponame: repo?.name }));
  }, [dispatch]);


  const handleLimitChange = (event) => {
    console.log("LimitChange", event.target.value);
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    console.log("PageChange", newPage);
    setPage(newPage);
  };

  const handleRowClick = (event, issue) => {
    console.log("Selected Issue", JSON.stringify(issue));
    navigate('/app/issue', { state:{ task: issue}, replace: false });
  };

  const tasks = repoInfo?.tasks?.map((task, index) => {
    const openIndex = repoInfo?.currentTasks?.findIndex(e => e.id == task.number);
    const reesolvedIndex = repoInfo?.resolvedTasks?.findIndex(e => e.githubIssueID == task.number);

    var _status = 'pending';
    var _task = task;
    if(openIndex > -1){
      _status = 'normal';
      _task = {...task, ...repoInfo?.currentTasks[openIndex]};
    }else if(reesolvedIndex > -1){
      _status = 'resolved';
      _task = {...task, ...repoInfo?.reesolvedIndex[reesolvedIndex]};
    }else{
      if(task.state == 'closed'){
        _status = 'closed';
      }else{
        _status = 'pending';
      }
    }

    return {..._task, status: _status};
  })

  return (
    <>
      <Helmet>
        <title>Issues</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <IssueListToolbar />
          <Box sx={{ pt: 3 }}>
            <IssueListResults
              issues={tasks ?? []}
              handleLimitChange={handleLimitChange}
              handlePageChange={handlePageChange}
              handleRowClick={handleRowClick}
              limit={limit}
              page={page}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default IssueList;
