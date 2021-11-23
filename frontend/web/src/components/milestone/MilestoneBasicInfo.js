import moment from 'moment';
import { v4 as uuid } from 'uuid';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

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

const MilestoneBasicInfo = (props) => {
  const milestone = props.milestone;

  return (
    <Card {...props}>
      <CardHeader title="Basic Info" />
      <Divider />
      <List>
        <ListItem>
          <ListItemText primary="Title" secondary={milestone?.title ?? '--'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Creator" secondary={milestone?.creator?.login ?? '--'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="Start Date" secondary={milestone?.created_at != undefined ? moment(milestone?.created_at).format('DD/MM/YYYY'): '--'} />
        </ListItem>
        <ListItem>
          <ListItemText primary="End Date" secondary={milestone?.created_at != undefined ? moment(milestone?.created_at).format('DD/MM/YYYY'): '--'} />
        </ListItem>
        {/* <ListItem>
          <Button sx={{width: '100%'}} variant="contained">Save</Button>
        </ListItem> */}
      </List>
    </Card>
  )
};

export default MilestoneBasicInfo;
