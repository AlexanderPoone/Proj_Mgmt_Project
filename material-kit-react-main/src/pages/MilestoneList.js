import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@material-ui/core';
import MilestoneListToolbar from '../components/milestone/MilestoneListToolbar';
import MilestoneListResults from 'src/components/milestone/MilestoneListResults';
import customers from 'src/__mocks__/customers';
import Burndown from 'src/components/dashboard/Burndown';

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
        <Grid
          container
          spacing={3}
        >

          <Grid
            item
            lg={10}
            md={10}
            xl={10}
            xs={12}
          >

            <Box
              width='100%'
            >
              <Burndown />
            </Box>

          </Grid>


        </Grid>
        {/* <MilestoneListToolbar /> */}
        <Box sx={{ pt: 3 }}>
          <MilestoneListResults customers={customers} />
        </Box>
      </Container>
    </Box>
  </>
);

export default MilestoneList;
