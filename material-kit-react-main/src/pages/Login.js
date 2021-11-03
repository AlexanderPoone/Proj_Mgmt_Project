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
import LoginGithub from 'react-login-github';
import { appProducts, setAccessToken } from 'src/reducers/AppReducer';

const Login = () => {
  const navigate = useNavigate();

  const { login, loading, error } = useSelector(loginProducts);
  const dispatch = useDispatch();
  const { app } = useSelector(appProducts);

  useEffect(() => {
    dispatch(setAccessToken('test'));
  }, [dispatch]);
  console.log('AccessToken:', app.accessToken);

  console.log('Github Login Res:', JSON.stringify(login));
  const onSuccess = response => console.log(response);
  const onFailure = response => console.error(response);

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
          <Formik
            initialValues={{
              email: 'demo@devias.io',
              password: 'Password123'
            }}
            validationSchema={Yup.object().shape({
              email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
              password: Yup.string().max(255).required('Password is required')
            })}
            onSubmit={() => {
              navigate('/repos', { replace: true });
            }}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>

                <Card>

                  <CardContent>

                    <Box sx={{ mb: 3 }}>
                      <Typography
                        color="textPrimary"
                        variant="h2"
                        sx={{ mb: 1 }}
                      >
                        CS5481 Project Sign In
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
                      // href= {`https://github.com/login/oauth/authorize?client_id=${ConfigData.GITHUB_CLIENT_ID}&redirect_uri=${ConfigData.REDIRECT_URI}`}
                      component={Link}
                      to='/repos'
                    >
                      Sign in now
                    </Button>
                  </CardContent>

                </Card>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Login;
