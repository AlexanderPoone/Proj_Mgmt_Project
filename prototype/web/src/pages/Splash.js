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

const Splash = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { app } = useSelector(appProducts);

  useEffect(()=>{
    if (Cookies.get(ConfigData.GITHUB_COOOKIE_NAME) == undefined || Cookies.get(ConfigData.GITHUB_COOOKIE_NAME) == null) {
      navigate('/login', { replace: true });
    }else{
      navigate('/repos', { replace: true });
    }
  },[]);
  
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

              <Box sx={{ mb: 3 }}>
                <Typography
                  color="textPrimary"
                  variant="h2"
                  sx={{ mb: 1 }}
                >
                  CS5351 Project
                </Typography>
              </Box>
            </CardContent>

          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Splash;
