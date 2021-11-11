import { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography
} from '@material-ui/core';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon
} from 'react-feather';
import NavItem from './NavItem';
import { useSelector } from 'react-redux';
import { userProducts } from 'src/reducers/UserReducer';
import { store } from 'src/store';


const items = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard'
  },
  {
    href: '/app/contributors',
    icon: SettingsIcon,
    title: 'Contributors'
  },
  {
    href: '/app/issues',
    icon: AlertCircleIcon,
    title: 'Tasks'
  },
  {
    href: '/repos',
    icon: ShoppingBagIcon,
    title: 'Repositories'
  },
  // {
  //   href: '/app/issue',
  //   icon: AlertCircleIcon,
  //   title: 'Issue Detail'
  // },
  // {
  //   href: '/app/milestone',
  //   icon: SettingsIcon,
  //   title: 'MileStones Detail'
  // },
  {
    href: '/login',
    icon: LockIcon,
    title: 'Logout'
  },
  // {
  //   href: '/register',
  //   icon: UserPlusIcon,
  //   title: 'Register'
  // },
];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();
  const userObj = userProducts(store.getState()).user;

  console.log('User State:', JSON.stringify(userObj));

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          p: 2
        }}
      >
        {userObj != undefined && userObj.avatar_url != undefined && <Avatar
          component={RouterLink}
          src={userObj.avatar_url}
          sx={{
            cursor: 'pointer',
            width: 64,
            height: 64,
            marginBottom: 1
          }}
          to="/app/account"
        />}
        {userObj != undefined && userObj.login != undefined && <Typography
          color="textSecondary"
          variant="body2"
        >
          {userObj.login}
        </Typography>}
      </Box>
      <Divider />
      <Box sx={{ p: 2 }}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box sx={{ flexGrow: 1 }} />

    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
          PaperProps={{
            sx: {
              width: 256
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden xlDown>
        <Drawer
          anchor="left"
          open
          variant="persistent"
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => {
  },
  openMobile: false
};

export default DashboardSidebar;
