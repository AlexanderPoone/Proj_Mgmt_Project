import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import IssueListToolbar from '../components/issue/IssueListToolbar';
import IssueListResults from 'src/components/issue/IssueListResults';
import customers from 'src/__mocks__/customers';
import { fetchGithubUserRepoIssuesAsync, issueProducts } from 'src/reducers/IssueReducer';
import { store } from 'src/store';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { reposProducts } from 'src/reducers/RepoReducer';
import { milestoneProducts } from 'src/reducers/MileStoneReducer';
import { useNavigate } from 'react-router-dom/umd/react-router-dom.development';

const IssueList = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const repo = reposProducts(store.getState());
  const mileStone = milestoneProducts(store.getState());
  const issue = issueProducts(store.getState());
  console.log("Issues:", JSON.stringify(issue.issues));

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(fetchGithubUserRepoIssuesAsync({ repoFullName: repo.repo.full_name, params: { mileStone: mileStone.number } }))
  }, [dispatch, page, limit]);


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
    navigate('/app/issue', { replace: false });
  };

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
              issues={issue.issues}
              handleLimitChange={handleLimitChange}
              handlePageChange={handlePageChange}
              handleRowClick={handleRowClick}
              limit={limit}
              page={page - 1}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default IssueList;
