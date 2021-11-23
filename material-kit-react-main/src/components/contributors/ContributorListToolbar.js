import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  CardHeader,
  Divider,
  Typography
} from '@material-ui/core';
import { Search as SearchIcon } from 'react-feather';

const ContributorListToolbar = (props) => (
  <Box {...props}>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end'
      }}
    >

      {/* <Button>
        Import
      </Button>
      <Button sx={{ mx: 1 }}>
        Export
      </Button>
      <Button
        color="primary"
        variant="contained"
      >
        Add customer
      </Button> */}
    </Box>
    <Box sx={{ mt: 3 }}>
      <Card>
        <CardContent>
          {/* <Box sx={{ maxWidth: 500 }}>
            <TextField
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SvgIcon
                      fontSize="small"
                      color="action"
                    >
                      <SearchIcon />
                    </SvgIcon>
                  </InputAdornment>
                )
              }}
              placeholder="Search customer"
              variant="outlined"
            />
          </Box> */}
          <Typography color="textPrimary"
            variant="h1">
            Contributors
          </Typography>
        </CardContent>
      </Card>
    </Box>
  </Box>
);

export default ContributorListToolbar;
