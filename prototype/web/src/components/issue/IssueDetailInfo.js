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
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
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

  const labelSchemes = [
    { key: 'software', value: 'Software', color: 'DC3545' },
    { key: 'performance', value: 'Performance', color: 'FFC107' },
    { key: 'documentation', value: 'Documentation', color: '198754' },
    { key: 'support', value: 'Support', color: '0D6EFD' },
    { key: 'feature-request', value: 'Feature Request', color: '0DCAF0' },
    { key: 'invalid', value: 'Invalid', color: 'F8F9FA' }
  ]

  const task = props.task;
  const [startDate, setStartDate] = useState();
  const [days, setDays] = useState();
  const [delayDays, setDelayDays] = useState();

  console.log('task.correctCat:', task?.correctCat);

  let correctCat = labelSchemes[labelSchemes.findIndex(e => e.key == task?.correctCat)];
  console.log('correctCat:', JSON.stringify(correctCat));

  const handleChange = (event) => {
    setLabel(event.target.value);
    // console.log(event.target.value);
  };

  const [label, setLabel] = useState();

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
                  {(correctCat != null && correctCat != undefined) && (<Typography variant='body2' color={correctCat?.key == 'invalid' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'} sx={{ bgcolor: `#${correctCat.color}`, borderRadius: 3, mr: 1, px: 1 }}>{`class:${correctCat.key}`}</Typography>)}
                  {(task.correctCat == null || task.correctCat == undefined) && task?.labels?.map(label => (<Typography variant='body2' color={label.name == 'class:invalid' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)'} sx={{ bgcolor: `#${label.color}`, borderRadius: 3, mr: 1, px: 1 }}>{label.name}</Typography>))}
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
                <Typography variant='body2' sx={{ mb: 1 }}>{task?.reassignUser?.login ?? (task?.assignee?.login ?? "--")}</Typography>
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

            {(task?.status == 'pending') && <Grid
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
                <Typography variant='body1' sx={{ mb: 1 }}>Reassign</Typography>
                <FormControl sx={{ mb: 3, minWidth: 300 }}>
                  <InputLabel id="demo-simple-select-label">Label</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={label}
                    label="Label"
                    onChange={handleChange}
                  >
                    {labelSchemes.map(e => (<MenuItem value={e.key}>{e.value}</MenuItem>))}
                  </Select>
                </FormControl>
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
        {(task?.status == 'pending') && <Button
          variant="contained"
          color="warning"
          sx={{ mr: 1 }}
          onClick={() => {
            props.onReassign(label)
          }}
        >
          Reassgin
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
