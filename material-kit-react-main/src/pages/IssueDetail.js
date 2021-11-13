import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid, Card, CardContent, } from '@material-ui/core';
import Burndown from 'src/components/dashboard/Burndown';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MileStones from 'src/components/dashboard/MileStones';
import Issues from 'src/components/dashboard/Issues';
import IssueBasicInfo from 'src/components/issue/IssueBasicInfo';
import IssueDetailInfo from 'src/components/issue/IssueDetailInfo';
import { useLocation, useNavigate } from 'react-router-dom';
import IssueDetailToolbar from 'src/components/issue/IssueDetailToolbar';
import { useDispatch } from 'react-redux';
import { confirmTaskAsync, delayTaskAsync, issueProducts, rejectTaskAsync, resolveTaskAsync, setConfirmTask, setDelayTask, setRejectTask, setResolvedTask } from 'src/reducers/IssueReducer';
import { reposProducts } from 'src/reducers/RepoReducer';
import { store } from 'src/store';
import moment from 'moment';

const IssueDetail = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const task = location.state?.task;
  const repo = reposProducts(store.getState()).repo;
  const confirmTask = issueProducts(store.getState()).confirmTask;
  const delayTask = issueProducts(store.getState()).delayTask;
  const rejectTask = issueProducts(store.getState()).rejectTask;
  const resolvedTask = issueProducts(store.getState()).resolvedTask;

  console.log("Select Task:", location.state?.task);

  const handleOnBackClick = () => {
    navigate(-1);
  }

  useEffect(()=>{
    if(confirmTask != null || delayTask != null || rejectTask != null || resolvedTask != null){
      navigate(-1);
    }
  },[confirmTask, delayTask, rejectTask, resolvedTask]);

  useEffect(()=>{
   return () => {
    dispatch(setConfirmTask(null));
    dispatch(setDelayTask(null));
    dispatch(setRejectTask(null));
    dispatch(setResolvedTask(null));
   }
  },[]);

  const handleOnConfirm = (startDate, days) => {
    console.log("Start Date:", moment(startDate).format('YYYY-MM-DD'));
    console.log("Days:", JSON.stringify(days));

    dispatch(confirmTaskAsync({
      owner: repo?.owner?.login,
      reponame: repo?.name,
      issueNum: task?.number,
      assignee: task?.assignee.login,
      startDate: moment(startDate).format('YYYY-MM-DD'),
      numdays: days
    }));
  }

  const handleOnDelay = (delaydays) => {
    console.log("Delay Days:", JSON.stringify(delaydays));

    dispatch(delayTaskAsync({
      owner: repo?.owner?.login,
      reponame: repo?.name,
      issueNum: task?.number,
      delaydays: delaydays
    }));
  }

  const handleOnReject = () => {

    dispatch(rejectTaskAsync({
      owner: repo?.owner?.login,
      reponame: repo?.name,
      issueNum: task?.number,
    }));
  }

  const handleOnResolve = () => {

    dispatch(resolveTaskAsync({
      owner: repo?.owner?.login,
      reponame: repo?.name,
      issueNum: task?.number,
      pullReqNum: task?.number,
    }));
  }

  return (<>
    <Helmet>
      <title>Issue</title>
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
            >
              <IssueDetailToolbar title={task?.title} onBackClick={handleOnBackClick} />
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
              <IssueDetailInfo task={task} onConfirm={handleOnConfirm} onDelay={handleOnDelay} onReject={handleOnReject} onResolve={handleOnResolve}/>
            </Box>

          </Grid>

          {/* <Grid
            item
            lg={4}
            md={4}
            xl={4}
            xs={12}
          >

            <Box
              width='100%'
            >
              <IssueBasicInfo />
            </Box>

          </Grid> */}
        </Grid>
      </Container>
    </Box>
  </>);
}

export default IssueDetail;
