import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid, Card, CardContent, } from '@material-ui/core';
import Burndown from 'src/components/dashboard/Burndown';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MileStones from 'src/components/dashboard/MileStones';
import Issues from 'src/components/dashboard/Issues';
import MilestoneDetailInfo from 'src/components/milestone/MilestoneDetailInfo';
import MilestoneBasicInfo from 'src/components/milestone/MilestoneBasicInfo';
import { fetchGithubUserRepoIssuesAsync, issueProducts } from 'src/reducers/IssueReducer';
import { store } from 'src/store';
import { useLocation, useNavigate } from 'react-router-dom/umd/react-router-dom.development';
import { useDispatch } from 'react-redux';
import { fetchGithubUserRepoMilestoneAsync, milestoneProducts } from 'src/reducers/MileStoneReducer';
import { reposProducts } from 'src/reducers/RepoReducer';
import IssueListResults from 'src/components/issue/IssueListResults';

const MilestoneDetail = () => {

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const repo = reposProducts(store.getState()).repo;
  const milestone = milestoneProducts(store.getState()).milestone;
  const issues = issueProducts(store.getState()).issues;
  const [value, onChange] = useState(new Date());

  console.log('Milestone number:', location.state?.number);

  useEffect(() => {
    dispatch(fetchGithubUserRepoMilestoneAsync({ repoFullName: repo.full_name, mileStoneNum: location.state?.number }));
    dispatch(fetchGithubUserRepoIssuesAsync({ repoFullName: repo.full_name, params: { milestone: location.state?.number } }));
  }, []);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

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
    navigate('/app/issue', { state:{
      number: issue.number
    },
     replace: false });
  };



  return (<>
    <Helmet>
      <title>Milestone</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={8}
            md={8}
            xl={9}
            xs={12}
          >

            <Box
              width='100%'
            >
              <Burndown />
            </Box>

          </Grid>

          <Grid
            item
            lg={4}
            md={4}
            xl={3}
            xs={12}
          >

            <Box
              width='100%'
            >
              <MilestoneBasicInfo milestone={milestone} />
            </Box>

          </Grid>

          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
          >

            <IssueListResults
              title={'Milestone Issues'}
              issues={issues}
              handleLimitChange={handleLimitChange}
              handlePageChange={handlePageChange}
              handleRowClick={handleRowClick}
              limit={limit}
              page={page - 1}
            />

          </Grid>
        </Grid>
      </Container>
    </Box>
  </>);
}

export default MilestoneDetail;
