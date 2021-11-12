import React, { useState } from 'react';
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

const IssueDetail = () => {

  const navigate = useNavigate();
  const location = useLocation();

  console.log("Issue number:", location.state?.number);

  const handleOnBackClick = () => {
    navigate(-1);
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
              <IssueDetailToolbar onBackClick={handleOnBackClick}/>
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
              <IssueDetailInfo />
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
