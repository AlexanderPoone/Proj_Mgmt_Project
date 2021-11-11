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
import { API, githubAPI } from './remotes/Api';
import { fetchGithubUserAsync } from './reducers/UserReducer';
import ConfigData from './config.json';
import { store } from './store';


const App = () => {
  const content = useRoutes(routes);
  const dispatch = useDispatch();
  const { accessToken } = useSelector(appProducts);
  const navigate = useNavigate();

  Cookies.set(ConfigData.GITHUB_COOOKIE_NAME, "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");

  useEffect(() => {
    dispatch(fetchGithubUserAsync());
  }, [dispatch]);

  console.log('AccessToken:', accessToken);

  // Add a request interceptor
  githubAPI.interceptors.request.use(function (config) {
    // Do something before request is sent

    console.log('Api Request Config:', JSON.stringify(config));
    return {
      ...config, headers: {
        Authorization: `Bearer ${Cookies.get(ConfigData.GITHUB_COOOKIE_NAME)}`,
        // Authorization: 'Bearer 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',
      },
    };
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Add a response interceptor
  githubAPI.interceptors.response.use(function (response) {
    console.log('Api Response:', JSON.stringify(response));
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    console.log("Github Error:", error.response);

    if (error.response.status != undefined && (error.response.status == 401 || error.response.status == 403)) {
      Cookies.remove(Cookies.get(ConfigData.GITHUB_COOOKIE_NAME));
      dispatch(setAccessToken(undefined));
      navigate('/login', { replace: true });
    }

    return Promise.reject(error);
  });

  // Add a request interceptor
  API.interceptors.request.use(function (config) {
    // Do something before request is sent

    console.log('Api Request Config:', JSON.stringify(config));
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Add a response interceptor
  API.interceptors.response.use(function (response) {
    console.log('Api Response:', JSON.stringify(response));
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error

    console.log("Github Error:", error.response);

    if ((error.response.status == 401 || error.response.status == 403)) {
      Cookies.remove(Cookies.get(ConfigData.GITHUB_COOOKIE_NAME));
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
