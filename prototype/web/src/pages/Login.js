import { Link, Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  CardContent,
  Card
} from '@material-ui/core';
import FacebookIcon from '../icons/Facebook';
import GoogleIcon from '../icons/Google';
import { useSelector, useDispatch } from "react-redux";
import { githubLoginAsyc, loginProducts } from 'src/reducers/LoginReducer';
import { useEffect } from 'react';
import ConfigData from '../config.json';
import { appProducts, setAccessToken } from 'src/reducers/AppReducer';
import Cookies from 'js-cookie';

const Login = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { app } = useSelector(appProducts);

  // if (Cookies.get(ConfigData.GITHUB_COOOKIE_NAME) != undefined && Cookies.get(ConfigData.GITHUB_COOOKIE_NAME) != null) {
  //   navigate('/repos', { replace: true });
  // }

  return (
    <>
      <Helmet>
        <title>CS5351 Project Login</title>
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

              <Box sx={{ mb: 3 }}>
                <Typography
                  color="textPrimary"
                  variant="h2"
                  sx={{ mb: 1 }}
                >
                  CS5351 Project Sign In
                </Typography>
                <Typography
                  color="textSecondary"
                  gutterBottom
                  variant="body2"
                >
                  Sign in with Github
                </Typography>
              </Box>
              <Button
                color="primary"
                // disabled={isSubmitting}
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                // target="_blank" 
                href={`https://github.com/login/oauth/authorize?client_id=${ConfigData.GITHUB_CLIENT_ID}&redirect_uri=${ConfigData.REDIRECT_URI}`}
              // component={Link}
              // to='/repos'
              >
                Sign in now
              </Button>
            </CardContent>

          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Login;
