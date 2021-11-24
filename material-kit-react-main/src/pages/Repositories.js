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

const Repositories = () => {
  const navigate = useNavigate();

  const Item = () => {
    return (
      <Card sx={{ height: 180 }} onClick={()=>{
        console.log('card view clicked');
        navigate('/app/dashboard', { replace: true });
      }}>

        <CardContent>
          1
        </CardContent>


      </Card>
    )
  }
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
              <Grid container spacing={2} columns={16}>
                <Grid item xs={4}>
                  <Item>xs=8</Item>
                </Grid>
                <Grid item xs={4}>
                  <Item>xs=4</Item>
                </Grid>
                <Grid item xs={4}>
                  <Item>xs=4</Item>
                </Grid>
                <Grid item xs={4}>
                  <Item>xs=8</Item>
                </Grid>
              </Grid>
            </CardContent>

          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Repositories;
