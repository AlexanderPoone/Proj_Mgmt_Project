import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import MilestoneListToolbar from '../components/milestone/MilestoneListToolbar';
import MilestoneListResults from 'src/components/milestone/MilestoneListResults';
import customers from 'src/__mocks__/customers';

const MilestoneList = () => (
  <>
    <Helmet>
      <title>Milestones</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <MilestoneListToolbar />
        <Box sx={{ pt: 3 }}>
          <MilestoneListResults customers={customers} />
        </Box>
      </Container>
    </Box>
  </>
);

export default MilestoneList;
