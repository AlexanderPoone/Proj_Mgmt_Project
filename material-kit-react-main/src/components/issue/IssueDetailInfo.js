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
  Link,
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
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { useLocation } from 'react-router';

const IssueDetailInfo = (props) => {

  const task = props.task;
  const [startDate, setStartDate] = useState();
  const [days, setDays] = useState();
  const [delayDays, setDelayDays] = useState();

  return (
    <Card {...props}>
      <CardHeader title={`Task Detail`} />
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
           {task?.labels?.length > 0 && <Grid
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
                  {task?.labels?.map(label => (<Typography variant='body2' color='rgb(255, 255, 255)' sx={{ bgcolor: `#${label.color}`, borderRadius: 3, mr: 1, px: 1 }}>{label.name}</Typography>))}
                </Box>
              </Box>

            </Grid>}

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
                <Typography variant='body1' sx={{ mb: 1 }}>Milestone</Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>{task?.milestone?.title ?? '--'}</Typography>
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
                <Typography variant='body1' sx={{ mb: 1 }}>Assignee</Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>{task?.assignee?.login ?? "--"}</Typography>
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
                  // alignItems: 'flex-start',
                }}
              >
                <Typography variant='body1' sx={{ mb: 1 }}>Description</Typography>
                <Typography variant='body2' sx={{ mb: 1 }} style={{ wordWrap: "break-word" }}>{task.body}</Typography>
              </Box>

            </Grid>

            {task.status == 'pending' && <Grid
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
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="DD/MM/YYYY"
                    value={startDate}
                    onChange={(newValue) => {
                      setStartDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                    inputFormat="dd/MM/yyyy"
                  />
                </LocalizationProvider>
              </Box>

            </Grid>}

            {task.status == 'normal' && <Grid
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
                <Typography variant='body2' sx={{ mb: 1 }}>{task?.start ? moment(task?.start).format('DD/MM/YYYY') : "--"}</Typography>
              </Box>

            </Grid>}

            {task.status == 'normal' && <Grid
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
                <Typography variant='body1' sx={{ mb: 1 }}>End Date</Typography>
                <Typography variant='body2' sx={{ mb: 1 }}>{task.end ? moment(task?.end).format('DD/MM/YYYY') : "--"}</Typography>
              </Box>

            </Grid>}

            {task.status == 'pending' && <Grid
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
                <TextField type="number" label="Days" variant="outlined"
                  onChange={e => {
                    console.log('Days:', e.target.value);
                    setDays(e.target.value > 0 ? e.target.value : 0);
                  }}
                />
              </Box>

            </Grid>}

            {task.status == 'normal' && <Grid
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
                <Typography variant='body1' sx={{ mb: 1 }}>Delay Days</Typography>
                <TextField id="outlined-basic" type="number" label="Days" variant="outlined"
                  onChange={e => {
                    console.log('Delay Days:', e.target.value);
                    setDelayDays(e.target.value > 0 ? e.target.value : 0);
                  }}
                />
              </Box>

            </Grid>}

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
                <Typography variant='body1' sx={{ mb: 1 }}>Github Link:</Typography>
                <Link href={task?.html_url} target="_blank" variant="body2">
                  {task?.html_url}
                </Link>
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
        {task?.status == 'pending' && <Button
          variant="contained"
          color="primary"
          sx={{ mr: 1 }}
          onClick={() => {
            props.onConfirm(startDate, days)
          }}
        >
          Confirm
        </Button>}
        {task?.status == 'normal' && <Button
          variant="contained"
          color="primary"
          sx={{ mr: 1 }}
          onClick={() => {
            props.onDelay(delayDays)
          }}
        >
          Delay
        </Button>}
        {task?.status == 'normal' && <Button
          variant="contained"
          color="error"
          sx={{ mr: 1 }}
          onClick={props.onReject}
        >
          Reject
        </Button>}
        {task?.status == 'normal' && <Button
          variant="contained"
          color="success"
          sx={{ mr: 1 }}
          onClick={props.onResolve}
        >
          Resolve
        </Button>}
      </Box>
    </Card>
  );
}

export default IssueDetailInfo;
