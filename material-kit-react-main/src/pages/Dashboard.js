import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid, Card, CardContent, CircularProgress, } from '@material-ui/core';
import Burndown from 'src/components/dashboard/Burndown';
import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
import MileStones from 'src/components/dashboard/MileStones';
import BigCalendar from 'src/components/dashboard/BigCalendar';
import moment from "moment";
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';
import { fetchBurnDownChartAsync, fetchRepoAsync, initialLabelAsync, reposProducts } from 'src/reducers/RepoReducer';
import { store } from 'src/store';
import Issues from 'src/components/dashboard/Issues';
import { useDispatch } from 'react-redux';
import { fetchGithubUserRepoIssuesAsync, issueProducts } from 'src/reducers/IssueReducer';
import IssueListResults from 'src/components/issue/IssueListResults';
import PendingTaskResults from 'src/components/issue/PendingTaskResults';
import { fetchContributorObjAsync, userProducts } from 'src/reducers/UserReducer';
import zIndex from '@material-ui/core/styles/zIndex';

const Dashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [value, onChange] = useState(new Date());
  const issues = issueProducts(store.getState()).issues;
  const repo = reposProducts(store.getState()).repo;
  const repoInfo = reposProducts(store.getState()).repoInfo;
  const burndownChart = reposProducts(store.getState()).burnDownChart;
  const reposLoading = reposProducts(store.getState()).reposLoading;
  // if(repo.repo == null){
  //   navigate('/repos', { replace: true });
  // }

  console.log('reposLoading:', reposLoading);

  useEffect(() => {
    // dispatch(fetchGithubUserRepoIssuesAsync({ repoFullName: repo.full_name }));
    dispatch(fetchRepoAsync({ owner: repo?.owner?.login, reponame: repo?.name }));
    dispatch(fetchContributorObjAsync({ owner: repo?.owner?.login, reponame: repo?.name }));
    dispatch(initialLabelAsync({ owner: repo?.owner?.login, reponame: repo?.name }));
    dispatch(fetchBurnDownChartAsync({ owner: repo?.owner?.login, reponame: repo?.name }));
  }, [dispatch]);

  const currentTasks = [];
  repoInfo?.tasks?.forEach((task) => {
    const index = repoInfo?.currentTasks?.findIndex(e => e.id == task.number)
    if (index > -1) {
      const newTask = { ...task, ...repoInfo?.currentTasks[index], status: 'normal' };
      currentTasks.push(newTask);
    }
  });
  console.log('CurrentTasks:', JSON.stringify(currentTasks));

  const pendingTasks = [];
  repoInfo?.tasks?.forEach((task) => {
    if (repoInfo?.currentTasks?.findIndex(e => e.id == task.number) < 0) {
      pendingTasks.push({ ...task, state: 'pending' });
    }
  });
  console.log('CurrentTasks:', JSON.stringify(pendingTasks));

  //REMARK: return to login if the access_token is undefined

  // const accessToken = Cookies.get('access_token');
  // if(accessToken == null){
  //   console.log('accessToken:', accessToken);
  //   setTimeout(()=>{navigate('/login', { replace: true });}, 500);
  // }

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

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
    navigate('/app/issue', {
      state: {
        task: issue
      },
      replace: false
    });
  };

  const handleOnSelectEvent = (event, e) => {
    console.log('Selected Event:', JSON.stringify(event));
    navigate('/app/issue', {
      state: {
        task: event.resource
      },
      replace: false
    });
  }


  return (<>
    <Helmet>
      <title>Dashboard | Material Kit</title>
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
            lg={12}
            md={12}
            xl={12}
            xs={12}
          >

            <Box
              width='100%'
              sx={{ mb: 3 }}
            >
              <BigCalendar
                title='Opened Tasks'
                // date={moment().toDate()}
                views={['month']}
                events={currentTasks?.map(task => ({
                  start: task.start ? moment(task.start).toDate() : moment().toDate(),
                  end: task.end ? moment(task.end).add(1, "days").toDate() : moment().add(1, "days").toDate(),
                  title: task.title,
                  allDay: true,
                  resource: task
                }))}
                selectable={true}
                onSelectEvent={handleOnSelectEvent}
              />
            </Box>

          </Grid>

          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
          >

            <Box
              width='100%'
            >
              <Burndown burndownChart={burndownChart} />
            </Box>

          </Grid>

          <Grid
            item
            lg={12}
            md={12}
            xl={12}
            xs={12}
          >
            <Box
              width='100%'
            >
              {pendingTasks.length > 0 && <PendingTaskResults title={'Pending Tasks'}
                issues={pendingTasks}
                handleLimitChange={handleLimitChange}
                handlePageChange={handlePageChange}
                handleRowClick={handleRowClick}
                limit={limit}
                page={page}
              />}
            </Box>

          </Grid>

        </Grid>
      </Container>
    </Box>
    {reposLoading &&
      <Box
        display="flex"
        sx={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          ml: 15,
          zIndex: 'modal',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
      </Box>}
  </>);
}

export default Dashboard;
