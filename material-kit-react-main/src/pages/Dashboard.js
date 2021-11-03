import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid, Card, CardContent, } from '@material-ui/core';
import Burndown from 'src/components/dashboard/Burndown';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MileStones from 'src/components/dashboard/MileStones';
import BigCalendar from 'src/components/dashboard/BigCalendar';
import moment from "moment";
import { useNavigate } from 'react-router';
import Cookies from 'js-cookie';

const Dashboard = () => {
  const navigate = useNavigate();
  const [value, onChange] = useState(new Date());

  const events = [
    {
      start: moment().toDate(),
      end: moment()
        .add(1, "days")
        .toDate(),
      title: "Some title"
    }
  ];

  //REMARK: return to login if the access_token is undefined

  // const accessToken = Cookies.get('access_token');
  // if(accessToken == null){
  //   console.log('accessToken:', accessToken);
  //   setTimeout(()=>{navigate('/login', { replace: true });}, 500);
  // }


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
            lg={10}
            md={10}
            xl={10}
            xs={10}
            spacing={3}
          >

            <Box
              width='100%'
              sx={{ mb: 3 }}
            >
              <BigCalendar events={events}/>
            </Box>

            <Box
              width='100%'
            >
              <MileStones/>
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

          {/* <Grid
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
              <Card>
                <CardContent>
                  <Calendar
                    onChange={onChange}
                    events={[]}
                    value={value}
                    // style={{ height: 120 }}
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


          </Grid> */}
        </Grid>
      </Container>
    </Box>
  </>);
}

export default Dashboard;
