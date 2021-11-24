import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import IssueListToolbar from '../components/issue/IssueListToolbar';
import IssueListResults from 'src/components/issue/IssueListResults';
import customers from 'src/__mocks__/customers';

const IssueList = () => (
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
        <IssueListToolbar />
        <Box sx={{ pt: 3 }}>
          <IssueListResults customers={customers} />
        </Box>
      </Container>
    </Box>
  </>
);

export default IssueList;
