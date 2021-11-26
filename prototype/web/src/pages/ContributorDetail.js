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
import { useDispatch } from 'react-redux';
import { assignTeamAsync, userProducts } from 'src/reducers/UserReducer';
import { reposProducts } from 'src/reducers/RepoReducer';
import { store } from 'src/store';

const ContributorDetail = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const contributor = location.state?.contributor;
  const repo = reposProducts(store.getState()).repo;

  console.log("Contributor:", JSON.stringify(contributor.login));

  const handleChange = (event) => {
    setRole(event.target.value);
    // console.log(event.target.value);
  };

  const handleOnBackClick = () => {
    navigate(-1);
  }

  const roleSchemes = [
    { key: 'developer', value: 'Developer' },
    { key: 'documentation', value: 'Documentation' },
    { key: 'tester', value: 'Tester' },
    { key: 'support', value: 'Support' }
  ]

  const [role, setRole] = React.useState(contributor?.roles[0] ?? '');

  return (
    <>
      <Helmet>
        <title>{`${contributor?.login} Role`}</title>
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

              <Box sx={{ mb: 1, marginLeft: -1 }}>
                <IconButton aria-label="arrow-back" onClick={handleOnBackClick}>
                  <ArrowBack />
                </IconButton>

              </Box>

              <Box sx={{ mb: 3 }}>

                <Typography
                  color="textPrimary"
                  variant="h2"
                >
                  {`${contributor?.login} Role`}
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
                  {roleSchemes.map(e => (<MenuItem value={e.key}>{e.value}</MenuItem>))}
                </Select>
              </FormControl>
              <Button
                color="primary"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                onClick={()=>{
                  dispatch(assignTeamAsync({owner: repo?.owner?.login, reponame: repo?.name, collaborator: contributor?.login, role: role}));
                }}
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
