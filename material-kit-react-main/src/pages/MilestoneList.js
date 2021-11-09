import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@material-ui/core';
import MilestoneListToolbar from '../components/milestone/MilestoneListToolbar';
import MilestoneListResults from 'src/components/milestone/MilestoneListResults';
import customers from 'src/__mocks__/customers';
import Burndown from 'src/components/dashboard/Burndown';
import { fetchGithubUserRepoMilestonesAsync, milestoneProducts } from 'src/reducers/MileStoneReducer';
import { store } from 'src/store';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { reposProducts } from 'src/reducers/RepoReducer';
import { userProducts } from 'src/reducers/UserReducer';
import { Link, Link as RouterLink, useNavigate } from 'react-router-dom';

const MilestoneList = () => {

  const dispatch = useDispatch();
  const milestone = milestoneProducts(store.getState());
  const navigate = useNavigate();
  const repo = reposProducts(store.getState());
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  console.log('Milestones:', JSON.stringify(milestone.milestones));

  useEffect(()=>{
    dispatch(fetchGithubUserRepoMilestonesAsync({repoFullName: repo.repo.full_name, params:{
      page: page,
      per_page: limit
    }}));
  }, [dispatch]);

  const handleLimitChange = (event) => {
    console.log("LimitChange", event.target.value);
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    console.log("PageChange", newPage);
    setPage(newPage);
  };

  const handleRowClick = (event, milestone) => {
    console.log("Selected milestone", JSON.stringify(milestone));
    navigate('/app/milestone', { replace: false });
  };

  return (

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
            <MilestoneListResults 
            milestones={milestone.milestones} 
            handleLimitChange={handleLimitChange}
            handlePageChange={handlePageChange}
            handleRowClick={handleRowClick}
            page={page - 1}
            limit={limit}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default MilestoneList;
