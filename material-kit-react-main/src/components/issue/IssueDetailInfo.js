import moment from 'moment';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { useState } from 'react';

const orders = [
  {
    id: uuid(),
    ref: 'CDD1049',
    amount: 30.5,
    customer: {
      name: 'Ekaterina Tankova'
    },
    createdAt: 1555016400000,
    status: 'pending'
  },
  {
    id: uuid(),
    ref: 'CDD1048',
    amount: 25.1,
    customer: {
      name: 'Cao Yu'
    },
    createdAt: 1555016400000,
    status: 'delivered'
  },
  {
    id: uuid(),
    ref: 'CDD1047',
    amount: 10.99,
    customer: {
      name: 'Alexa Richardson'
    },
    createdAt: 1554930000000,
    status: 'refunded'
  },
  {
    id: uuid(),
    ref: 'CDD1046',
    amount: 96.43,
    customer: {
      name: 'Anje Keizer'
    },
    createdAt: 1554757200000,
    status: 'pending'
  },
  {
    id: uuid(),
    ref: 'CDD1045',
    amount: 32.54,
    customer: {
      name: 'Clarke Gillebert'
    },
    createdAt: 1554670800000,
    status: 'delivered'
  },
  {
    id: uuid(),
    ref: 'CDD1044',
    amount: 16.76,
    customer: {
      name: 'Adam Denisov'
    },
    createdAt: 1554670800000,
    status: 'delivered'
  }
];


const IssueDetailInfo = (props) => {

  const [value, setValue] = useState(null);

  return (
    <Card {...props}>
      <CardHeader title="Task Detail" />
      <Divider />
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        // height: 400,
        alignItems: 'flex-start',
        p: 2
      }}>
        <Container maxWidth={false}>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              lg={12}
              md={12}
              xl={12}
              xs={12}
            >

              <Box
                width='100%'
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  // height: 400,
                  alignItems: 'flex-start',
                }}
              >
                <Typography variant='body1' sx={{ mb: 1 }}>Label</Typography>
                <Box
                  width='100%'
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    // height: 400,
                    alignItems: 'flex-start',
                  }}>
                  <Typography variant='body2' color='rgb(255, 255, 255)' sx={{ bgcolor: 'rgb(148, 148, 148)', borderRadius: 3, mr: 1, px: 1 }}>Label1</Typography>
                  <Typography variant='body2' color='rgb(255, 255, 255)' sx={{ bgcolor: '#5F2ED6', borderRadius: 3, mr: 1, px: 1 }}>Label2</Typography>
                </Box>
              </Box>

            </Grid>

            <Grid
              item
              lg={12}
              md={12}
              xl={12}
              xs={12}
            >

              <Box
                width='100%'
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  // height: 400,
                  alignItems: 'flex-start',
                }}
              >
                <Typography variant='body1' sx={{ mb: 1 }}>Title</Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>Task Name</Typography>
              </Box>

            </Grid>

            <Grid
              item
              lg={12}
              md={12}
              xl={12}
              xs={12}
            >

              <Box
                width='100%'
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  // height: 400,
                  alignItems: 'flex-start',
                }}
              >
                <Typography variant='body1' sx={{ mb: 1 }}>Start Date</Typography>
                <TextField id="outlined-basic" label="DD-MM-YYYY" variant="outlined" />
              </Box>

            </Grid>

            <Grid
              item
              lg={12}
              md={12}
              xl={12}
              xs={12}
            >

              <Box
                width='100%'
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  // height: 400,
                  alignItems: 'flex-start',
                }}
              >
                <Typography variant='body1' sx={{ mb: 1 }}>Days</Typography>
                <TextField id="outlined-basic" label="Days" variant="outlined" />
              </Box>

            </Grid>

          </Grid>
        </Container>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 1 }}
        >
          Create
        </Button>
        <Button
          variant="contained"
          color="success"
          sx={{ mr: 1 }}
        >
          Approve
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ mr: 1 }}
        >
          Delete
        </Button>
      </Box>
    </Card>
  );
}

export default IssueDetailInfo;
