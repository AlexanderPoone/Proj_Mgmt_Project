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

const IssueDetail = () => {

  const [value, onChange] = useState(new Date());


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
            lg={8}
            md={8}
            xl={9}
            xs={12}
          >

            <Box
              width='100%'
            >
              <IssueBasicInfo />
            </Box>

          </Grid>

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
              <IssueDetailInfo />
            </Box>

          </Grid>
        </Grid>
      </Container>
    </Box>
  </>);
}

export default IssueDetail;
