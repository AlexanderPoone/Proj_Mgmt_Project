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

const ContributorList = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const repo = reposProducts(store.getState());
  const mileStone = milestoneProducts(store.getState());
  const issues = issueProducts(store.getState()).issues;

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  const dummy = {
    "contributorRoles": [
        [
            "tester",
            "Tester Team",
            "warning"
        ],
        [
          "developer",
          "Develop Team",
          "warning"
      ]
    ],
    "contributors": [
        {
            "avatar_url": "https://avatars.githubusercontent.com/u/10739866?v=4",
            "id": 111111,
            "login": "Abc123",
            "type": "User",
        },
        {
          "avatar_url": "https://avatars.githubusercontent.com/u/10739866?v=4",
          "id": 2222222,
          "login": "BBB123",
          "type": "User",
      }
    ]
}

  useEffect(() => {
    dispatch(fetchGithubUserRepoIssuesAsync({ repoFullName: repo.repo.full_name, params: { mileStone: mileStone.number } }))
  }, [dispatch, page, limit]);


  const handleLimitChange = (event) => {
    console.log("LimitChange", event.target.value);
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    console.log("PageChange", newPage);
    setPage(newPage);
  };

  const handleRowClick = (event, issue) => {
    console.log("Selected Issue", JSON.stringify(issue));
    navigate('/app/contributor', { replace: false });
  };

  let contributors = dummy.contributors.map( (e, i) => {
    e['roles'] = dummy.contributorRoles[i];
    return e;
  })

  console.log('contributors', JSON.stringify(contributors));


  return (
    <>
      <Helmet>
        <title>Issues</title>
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
              contributors={contributors}
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
