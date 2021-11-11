import { Navigate } from 'react-router-dom';
import DashboardLayout from './components/DashboardLayout';
import MainLayout from './components/MainLayout';
import Account from './pages/Account';
import CustomerList from './pages/CustomerList';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ProductList from './pages/ProductList';
import Register from './pages/Register';
import Settings from './pages/Settings';
import IssueList from './pages/IssueList';
import MilestoneList from './pages/MilestoneList';
import MilestoneDetail from './pages/MilestoneDetail';
import IssueDetail from './pages/IssueDetail';
import Repositories from './pages/Repositories';
import Splash from './pages/Splash';
import RoleList from './pages/ContributorList';
import RoleDetail from './pages/ContributorDetail';
import ContributorDetail from './pages/ContributorDetail';
import ContributorList from './pages/ContributorList';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'customers', element: <CustomerList /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'products', element: <ProductList /> },
      { path: 'settings', element: <Settings /> },
      { path: 'milestones', element: <MilestoneList /> },
      { path: 'issues', element: <IssueList /> },
      { path: 'issue', element: <IssueDetail /> },
      { path: 'contributors', element: <ContributorList /> },
      { path: 'contributor', element: <ContributorDetail /> },
      { path: 'milestone', element: <MilestoneDetail /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'repos', element: <Repositories /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Splash /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  }
];

export default routes;
