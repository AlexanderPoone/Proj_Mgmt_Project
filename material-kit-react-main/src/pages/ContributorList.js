import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import IssueListToolbar from '../components/issue/IssueListToolbar';
import IssueListResults from 'src/components/issue/IssueListResults';
import customers from 'src/__mocks__/customers';
import { fetchGithubUserRepoIssuesAsync, issueProducts } from 'src/reducers/IssueReducer';
import { store } from 'src/store';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { reposProducts } from 'src/reducers/RepoReducer';
import { milestoneProducts } from 'src/reducers/MileStoneReducer';
import { useNavigate } from 'react-router-dom/umd/react-router-dom.development';
import ContributorListResults from 'src/components/contributors/ContributorListResults';
import ContributorListToolbar from 'src/components/contributors/ContributorListToolbar';
import { fetchContributorObjAsync, userProducts } from 'src/reducers/UserReducer';

const ContributorList = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const repo = reposProducts(store.getState()).repo;
  const mileStone = milestoneProducts(store.getState());
  let contributorObj = userProducts(store.getState()).contributorObj;

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  useEffect(() => {
    // dispatch(fetchGithubUserRepoIssuesAsync({ repoFullName: repo.repo.full_name, params: { mileStone: mileStone.number } }));
    dispatch(fetchContributorObjAsync({ owner: repo?.owner?.login, reponame: repo?.name }));
  }, [dispatch, page, limit]);


  const handleLimitChange = (event) => {
    console.log("LimitChange", event.target.value);
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    console.log("PageChange", newPage);
    setPage(newPage);
  };

  const handleRowClick = (event, contributor) => {
    console.log("Selected contributor:", JSON.stringify(contributor));
    navigate('/app/contributor', { state: { contributor: contributor }, replace: false });
  };

  let contributors = contributorObj?.contributors?.map((e, i) => {
    return { ...e, 'roles': contributorObj?.contributorRoles[i] };
  })

  console.log('Contributors:', JSON.stringify(contributors));


  return (
    <>
      <Helmet>
        <title>Contributors</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth={false}>
          <ContributorListToolbar />
          <Box sx={{ pt: 3 }}>
            <ContributorListResults
              contributors={contributors ?? []}
              handleLimitChange={handleLimitChange}
              handlePageChange={handlePageChange}
              handleRowClick={handleRowClick}
              limit={limit}
              page={page - 1}
            />
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default ContributorList;
