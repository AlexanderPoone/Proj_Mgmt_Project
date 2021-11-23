import { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';
import getInitials from '../../utils/getInitials';

const MilestoneListResults = ({ milestones, ...props }) => {
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  const handleSelectAll = (event) => {
    let newSelectedCustomerIds;

    if (event.target.checked) {
      newSelectedCustomerIds = milestones.map((milestone) => milestone.id);
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

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...props}>
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
                  MileStone #
                </TableCell>
                <TableCell>
                  Title
                </TableCell>
                <TableCell>
                  Open Issues
                </TableCell>
                <TableCell>
                  State
                </TableCell>
                <TableCell>
                  End day
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {milestones.map((milestone) => (
                <TableRow
                  hover
                  key={milestone.id}
                  selected={selectedCustomerIds.indexOf(milestone.id) !== -1}
                  onClick={(event)=>{
                    props.handleRowClick(event, milestone);
                  }}
                >
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedCustomerIds.indexOf(customer.id) !== -1}
                      onChange={(event) => handleSelectOne(event, customer.id)}
                      value="true"
                    />
                  </TableCell> */}
                  <TableCell>
                    {milestone.number}
                  </TableCell>
                  <TableCell>
                    {milestone.title}
                  </TableCell>
                  <TableCell>
                    {milestone.open_issues}
                  </TableCell>
                  <TableCell>
                    {milestone.state}
                  </TableCell>
                  <TableCell>
                    {moment('2021-11-22').format('DD/MM/YYYY')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={milestones.length}
        onPageChange={props.handlePageChange}
        onRowsPerPageChange={props.handleLimitChange}
        page={props.page}
        rowsPerPage={props.limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

MilestoneListResults.propTypes = {
  milestones: PropTypes.array.isRequired
};

export default MilestoneListResults;
