import { Bar, Line } from 'react-chartjs-2';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  useTheme,
  colors
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";



const Burndown = (props) => {
  const theme = useTheme();
  const localizer = momentLocalizer(moment);


  const rand = () => Math.round(Math.random() * 100 - 50);
  const data = {
    labels: ['11/11/2021', '12/11/2021', '13/11/2021', '13/11/2021', '14/11/2021', '15/11/2021', '16/11/2021'],
    datasets: [
      {
        type: 'line',
        label: 'Ideal',
        borderColor: 'rgb(134, 134, 134)',
        borderWidth: 2,
        backgroundColor: 'rgb(134, 134, 134)',
        fill: false,
        data: [10, 7, 5, 4, 3, 1, 0],
      },
      {
        type: 'line',
        label: 'Real',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 2,
        backgroundColor: 'rgb(54, 162, 235)',
        fill: false,
        data: [10, 9, 8],
      },
      {
        type: 'bar',
        label: 'Positive',
        backgroundColor: 'rgb(75, 192, 192)',
        data: [1, 0, 1],
        borderColor: 'white',
        borderWidth: 2,
      },
      {
        type: 'bar',
        label: 'Negative',
        backgroundColor: 'rgb(255, 99, 132)',
        data: [0, -1, 0],
      },
    ],
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: theme.palette.text.secondary,
            beginAtZero: true,
            min: 0
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: theme.palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: theme.palette.divider
          }
        }
      ]
    },
    tooltips: {
      backgroundColor: theme.palette.background.paper,
      bodyFontColor: theme.palette.text.secondary,
      borderColor: theme.palette.divider,
      borderWidth: 1,
      enabled: true,
      footerFontColor: theme.palette.text.secondary,
      intersect: false,
      mode: 'index',
      titleFontColor: theme.palette.text.primary
    }
  };

  const state = {
    events: [
      // {
      //   start: moment().toDate(),
      //   end: moment()
      //     .add(1, "days")
      //     .toDate(),
      //   title: "Some title"
      // }
    ]
  };

  return (
    <Card {...props}>
      <CardHeader
        // action={(
        //   <Button
        //     endIcon={<ArrowDropDownIcon />}
        //     size="small"
        //     variant="text"
        //   >
        //     Last 7 days
        //   </Button>
        // )}
        title="Burndown Chart"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            position: 'relative'
          }}
        >
          {/* <Line
            data={data}
            options={options}
          /> */}

          <Bar data={data} />
        </Box>
      </CardContent>
      {/* <Divider /> */}
      {/* <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          p: 2
        }}
      >
        <Button
          color="primary"
          endIcon={<ArrowRightIcon />}
          size="small"
          variant="text"
        >
          Overview
        </Button>
      </Box> */}
    </Card>
  );
};

export default Burndown;
