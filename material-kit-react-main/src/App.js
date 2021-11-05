import 'react-perfect-scrollbar/dist/css/styles.css';
import { useRoutes, useNavigate } from 'react-router-dom';
import { ThemeProvider, StyledEngineProvider } from '@material-ui/core';
import GlobalStyles from './components/GlobalStyles';
import theme from './theme';
import routes from './routes';
import { appProducts, setAccessToken } from 'src/reducers/AppReducer';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { githubAPI } from './remotes/Api';
import { fetchGithubUserAsync } from './reducers/UserReducer';


const App = () => {
  const content = useRoutes(routes);
  const dispatch = useDispatch();
  const { app } = useSelector(appProducts);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchGithubUserAsync());
  }, [dispatch]);

  console.log('AccessToken:', app.accessToken);

  // Add a request interceptor
  githubAPI.interceptors.request.use(function (config) {
    // Do something before request is sent
    return {
      ...config, headers: {
        // Authorization: `Bearer ${Cookies.get('github_access_token')}`,
        Authorization: 'Bearer xxxxxxxxxxx',
      },
    };
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Add a response interceptor
  githubAPI.interceptors.response.use(function (response) {
    response.status
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    console.log("Github Error:", error.response);

    if (error.response.status != undefined && (error.response.status == 401 || error.response.status == 403)) {
      Cookies.remove('github_access_token', { path: '' });
      dispatch(setAccessToken(undefined));
      navigate('/login', { replace: true });
    }

    return Promise.reject(error);
  });

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {content}
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
