import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Checkbox,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import getInitials from '../../utils/getInitials';

const IssueListResults = ({ issues, ...props }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = issues.map((issue) => issue.id);
    } else {
      newSelectedCustomerIds = [];
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedCustomerIds.indexOf(id);
    let newSelectedCustomerIds = [];

    if (selectedIndex === -1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds, id);
    } else if (selectedIndex === 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(1));
    } else if (selectedIndex === selectedCustomerIds.length - 1) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(selectedCustomerIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedCustomerIds = newSelectedCustomerIds.concat(
        selectedCustomerIds.slice(0, selectedIndex),
        selectedCustomerIds.slice(selectedIndex + 1)
      );
    }

    setSelectedCustomerIds(newSelectedCustomerIds);
  };

  // const handleLimitChange = (event) => {
  //   setLimit(event.target.value);
  // };

  // const handlePageChange = (event, newPage) => {
  //   setPage(newPage);
  // };

  // const handleRowClick = (event, issue) => {
  //   console.log("Selected Issue", JSON.stringify(issue));
  // };

  return (
    <Card {...props}>
      {props.title && <CardHeader title={props.title} />}
      {props.title && <Divider />}
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                {/* <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedCustomerIds.length === customers.length}
                    color="primary"
                    indeterminate={
                      selectedCustomerIds.length > 0
                      && selectedCustomerIds.length < customers.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell> */}
                <TableCell>
                  Task #
                </TableCell>
                <TableCell>
                  Title
                </TableCell>
                <TableCell>
                  State
                </TableCell>
                <TableCell>
                  Assignee
                </TableCell>
                <TableCell>
                  Start Date
                </TableCell>
                <TableCell>
                  End Date
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issues.map((issue) => {

                var stateStr = 'Pending';
                switch (issue.status) {
                  case "normal":
                    stateStr = "Opening";
                    break;
                  case "resolved":
                    stateStr = "Resolved";
                    break;
                  case "closed":
                    stateStr = "Closed";
                    break;
                  case "pending":
                    stateStr = "Pending";
                    break;
                }

                return (
                  <TableRow
                    hover
                    key={issue.id}
                    selected={selectedCustomerIds.indexOf(issue.id) !== -1}
                    onClick={event => { props.handleRowClick(event, issue) }}
                  >
                    {/* <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedCustomerIds.indexOf(customer.id) !== -1}
                        onChange={(event) => handleSelectOne(event, customer.id)}
                        value="true"
                      />
                    </TableCell> */}
                    <TableCell>
                      <Typography
                        color="textPrimary"
                        variant="body2"
                      >
                        {issue.number}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textPrimary"
                        variant="body2"
                      >
                        {issue.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textPrimary"
                        variant="body2"
                      >
                        {stateStr}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textPrimary"
                        variant="body2"
                      >
                        {issue.assignee?.login}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textPrimary"
                        variant="body2"
                      >
                        {issue.start ? moment(issue.start).format('DD/MM/YYYY') : "--"}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        color="textPrimary"
                        variant="body2"
                      >
                        {issue.end ? moment(issue.end).format('DD/MM/YYYY') : "--"}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={issues.length}
        onPageChange={props.handlePageChange}
        onRowsPerPageChange={props.handleLimitChange}
        page={props.page}
        rowsPerPage={props.limit}
        rowsPerPageOptions={[10, 50, 100]}
      />
    </Card>
  );
};

IssueListResults.propTypes = {
  customers: PropTypes.array.isRequired
};

export default IssueListResults;
