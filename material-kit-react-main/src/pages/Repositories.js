import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Link,
  TextField,
  Typography,
  CardContent,
  Card
} from '@material-ui/core';
import FacebookIcon from '../icons/Facebook';
import GoogleIcon from '../icons/Google';
import ButtonBase from '@material-ui/core/ButtonBase';
import { fetchGithubUserReposAsync, reposProducts, setRepo } from 'src/reducers/RepoReducer';
import { store } from 'src/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import RepoGridCell from 'src/components/dashboard/RepoGridCell';
import { updateDashBoardAsyc } from 'src/reducers/AppReducer';

const Repositories = () => {
  const navigate = useNavigate();
  const repo = reposProducts(store.getState());
  const dispatch = useDispatch();


  console.log('Sekected Repo:', JSON.stringify(repo.repo));

  const Item = () => {
    return (
      <RepoGridCell onClick={() => {
        console.log('card view clicked');
        // navigate('/app/dashboard', { replace: true });
      }} />
    )
  }

  useEffect(() => {
    dispatch(fetchGithubUserReposAsync());
    dispatch(updateDashBoardAsyc());
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Repositories</title>
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
        <Container maxWidth="xl">
          <Card>

            <CardContent>

              <Box sx={{ mb: 3, flexDirection: 'column', }}>
                <Typography
                  color="textPrimary"
                  variant="h2"
                  sx={{ mb: 1 }}
                >
                  Please select Repository
                </Typography>
              </Box>
              <Grid container spacing={2} columns={16} direction={"row"}>
                {repo.repos.map(i => (<Grid item xs={4}>
                  <RepoGridCell 
                  // sx={{height: 180}}
                   item ={i} 
                   onClick={(repo) => {
                    console.log('Selected Repo:', JSON.stringify(repo));
                    dispatch(setRepo(repo));
                    navigate('/app/dashboard', { replace: true });
                  }} />
                </Grid>))}
              </Grid>
            </CardContent>

          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Repositories;
