import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container, Grid, Card, CardContent, Typography, Button, FormControl, InputLabel, Select, MenuItem, IconButton, CardHeader, } from '@material-ui/core';
import Burndown from 'src/components/dashboard/Burndown';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import MileStones from 'src/components/dashboard/MileStones';
import Issues from 'src/components/dashboard/Issues';
import IssueBasicInfo from 'src/components/issue/IssueBasicInfo';
import IssueDetailInfo from 'src/components/issue/IssueDetailInfo';
import { useLocation, useNavigate } from 'react-router-dom';
import IssueDetailToolbar from 'src/components/issue/IssueDetailToolbar';
import { ArrowBack } from '@material-ui/icons';

const ContributorDetail = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = React.useState('');

  const handleChange = (event) => {
    setRole(event.target.value);
  };

  console.log("Issue number:", location.state?.number);

  const handleOnBackClick = () => {
    navigate(-1);
  }

  return (
    <>
      <Helmet>
        <title>Login | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth="sm">
          <Card>

            <CardContent>

              <Box sx={{ mb: 1, marginLeft:-1 }}>
                <IconButton aria-label="arrow-back" onClick={handleOnBackClick}>
                  <ArrowBack />
                </IconButton>

              </Box>

              <Box sx={{ mb: 3 }}>

                <Typography
                  color="textPrimary"
                  variant="h2"
                >
                  User Role
                </Typography>
              </Box>
              <FormControl sx={{ mb: 3 }}
                fullWidth>
                <InputLabel id="demo-simple-select-label">Role</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={role}
                  label="Age"
                  onChange={handleChange}
                >
                  <MenuItem value={'developer'}>Developer</MenuItem>
                  <MenuItem value={'tester'}>Tester</MenuItem>
                </Select>
              </FormControl>
              <Button
                color="primary"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
              >
                Save
              </Button>
            </CardContent>

          </Card>
        </Container>
      </Box>
    </>
  );
}

export default ContributorDetail;
