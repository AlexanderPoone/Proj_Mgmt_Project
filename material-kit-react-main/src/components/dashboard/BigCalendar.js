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
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import "react-big-calendar/lib/css/react-big-calendar.css";


const BigCalendar = (props) => {
  const theme = useTheme();
  const localizer = momentLocalizer(moment);

  console.log('BigCalendar props =>', JSON.stringify(props));

  return (
    <Card {...props}>
      <CardHeader
        title="Calendar"
      />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 600,
            position: 'relative'
          }}
        >
          <Calendar
            date={props.date}
            localizer={localizer}
            views={props.views}
            events={props.events ?? []}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            onSelectEvent={props.onSelectEvent}
            selectable={props.selectable}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default BigCalendar;
