import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid, Card, CardContent, } from '@material-ui/core';
import Burndown from 'src/components/dashboard/Burndown';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MileStones from 'src/components/dashboard/MileStones';
import Issues from 'src/components/dashboard/Issues';

const Dashboard = () => {

  const [value, onChange] = useState(new Date());


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
            lg={8}
            md={8}
            xl={9}
            xs={12}
            spacing={3}
          >

            <Box
              width='100%'
              sx={{ mb: 3 }}
            >
              <Burndown />
            </Box>

            <Box
              width='100%'
            >
              <MileStones />
            </Box>

          </Grid>
          {/* <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <Budget />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalCustomers />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TasksProgress />
          </Grid>
          <Grid
            item
            lg={3}
            sm={6}
            xl={3}
            xs={12}
          >
            <TotalProfit sx={{ height: '100%' }} />
          </Grid> */}

          <Grid
            item
            lg={4}
            md={4}
            xl={3}
            xs={12}
          >

            <Box
              width='100%'
              sx={{ mb: 2 }}
            >
              {/* <TrafficByDevice sx={{ height: '100%' }} /> */}
              <Card>
                <CardContent>
                  <Calendar
                    onChange={onChange}
                    value={value}
                  />
                </CardContent>
              </Card>

            </Box>

            <Box
              width='100%'
            >
              <Card>
                <CardContent>
                  <Issues />
                </CardContent>
              </Card>

            </Box>


          </Grid>
          {/* <Grid
            item
            lg={4}
            md={6}
            xl={3}
            xs={12}
          >
            <LatestProducts sx={{ height: '100%' }} />
          </Grid> */}
        </Grid>
      </Container>
    </Box>
  </>);
}

export default Dashboard;
