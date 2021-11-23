import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import Api from '../remotes/Api'

export const fetchGithubUserReposAsync = createAsyncThunk(
    'user/fetchGithubUserRepos',
    async (_, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.fetchGithubUserRepos()
            return response.data
        } catch (err) {
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            // We got validation errors, let's return those so we can reference in our component and set form errors
            console.log('error.response.data:', error.response.data);
            return rejectWithValue(error.response.data)
        }
    }
)

export const fetchRepoAsync = createAsyncThunk(
    'repo/fetchRepoAsync',
    async (props, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.fetchRepo(props)
            return response.data
        } catch (err) {
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            // We got validation errors, let's return those so we can reference in our component and set form errors
            console.log('error.response.data:', error.response.data);
            return rejectWithValue(error.response.data)
        }
    }
)

export const initialLabelAsync = createAsyncThunk(
    'repo/initialLabelAsync',
    async (props, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.initialLabel(props)
            return response.data
        } catch (err) {
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            // We got validation errors, let's return those so we can reference in our component and set form errors
            console.log('error.response.data:', error.response.data);
            return rejectWithValue(error.response.data)
        }
    }
)

export const fetchBurnDownChartAsync = createAsyncThunk(
    'repo/fetchBurnDownChartAsync',
    async (props, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.fetchBurnDownChart(props)
            return response.data
        } catch (err) {
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            // We got validation errors, let's return those so we can reference in our component and set form errors
            console.log('error.response.data:', error.response.data);
            return rejectWithValue(error.response.data)
        }
    }
)


const initialState = {
    repos: [],
    repo: null,
    labelObj: null,
    loading: false,
    error: null,
    repoInfo: null,
    burnDownChart:[]
}

const reposSlice = createSlice({
    name: 'repo',
    initialState,
    reducers: {
        setRepos: (state, action) => {
            state.repos = action.payload;
        },
        setRepo: (state, action) => {
            state.repo = action.payload;
        },
        setTasksRepo: (state, action) => {
            state.tasksRepo = action.payload;
        },
        setLabelObj: (state, action) => {
            state.labelObj = action.payload;
        },
        setBurnDownChart: (state, action) => {
            state.burnDownChart = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchGithubUserReposAsync.pending, (state, action) => {
            state.loading = true;
            state.repos = [];
            state.error = null;
        }).addCase(fetchGithubUserReposAsync.fulfilled, (state, { payload }) => {
            state.loading = false
            state.repos = payload;
            state.error = null;
        }).addCase(fetchGithubUserReposAsync.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }).addCase(fetchRepoAsync.pending, (state, action) => {
            state.loading = true;
            state.repoInfo = null;
            state.error = null;
        }).addCase(fetchRepoAsync.fulfilled, (state, { payload }) => {
            state.loading = false
            state.repoInfo = payload;
            state.error = null;
        }).addCase(fetchRepoAsync.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.repoInfo = null;
        }).addCase(initialLabelAsync.pending, (state, action) => {
            state.loading = true;
            state.labelObj = null;
            state.error = null;
        }).addCase(initialLabelAsync.fulfilled, (state, { payload }) => {
            state.loading = false
            state.labelObj = payload;
            state.error = null;
        }).addCase(initialLabelAsync.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.labelObj = null;
        }).addCase(fetchBurnDownChartAsync.pending, (state, action) => {
            state.loading = true;
            state.burnDownChart = [];
            state.error = null;
        }).addCase(fetchBurnDownChartAsync.fulfilled, (state, { payload }) => {
            state.loading = false
            state.burnDownChart = payload;
            state.error = null;
        }).addCase(fetchBurnDownChartAsync.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.burnDownChart = [];
        })
    },
})


export const { setRepos, setRepo, setTasksRepo, setLabelObj } = reposSlice.actions;

export const reposProducts = createSelector(
    (state) => ({
        repos: state.repo.repos,
        repo: state.repo.repo,
        repoInfo: state.repo.repoInfo,
        reposLoading: state.repo.loading,
        reposError: state.repo.error,
        labelObj: state.repo.labelObj,
        burnDownChart: state.repo.burnDownChart
    }), (state) => state
);

export default reposSlice.reducer;