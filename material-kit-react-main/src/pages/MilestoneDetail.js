import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid, Card, CardContent, } from '@material-ui/core';
import Burndown from 'src/components/dashboard/Burndown';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MileStones from 'src/components/dashboard/MileStones';
import Issues from 'src/components/dashboard/Issues';
import MilestoneDetailInfo from 'src/components/milestone/MilestoneDetailInfo';
import MilestoneBasicInfo from 'src/components/milestone/MilestoneBasicInfo';

const MilestoneDetail = () => {

  const [value, onChange] = useState(new Date());


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
              <MilestoneBasicInfo />
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
              <MilestoneDetailInfo />
            </Box>

          </Grid>
        </Grid>
      </Container>
    </Box>
  </>);
}

export default MilestoneDetail;
