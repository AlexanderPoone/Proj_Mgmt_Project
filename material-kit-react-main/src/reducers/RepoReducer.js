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
    'user/fetchRepoAsync',
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


const initialState = {
    repos: [],
    repo: null,
    loading: false,
    error: null,
    tasksRepo: null
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
            state.tasksRepo = null;
            state.error = null;
        }).addCase(fetchRepoAsync.fulfilled, (state, { payload }) => {
            state.loading = false
            state.tasksRepo = payload;
            state.error = null;
        }).addCase(fetchRepoAsync.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.tasksRepo = null;
        })
    },
})


export const { setRepos, setRepo } = reposSlice.actions;

export const reposProducts = createSelector(
    (state) => ({
        repos: state.repo.repos,
        repo: state.repo.repo,
        tasksRepo: state.repo.tasksRepo,
        reposLoading: state.repo.loading,
        reposError: state.repo.error,
    }), (state) => state
);

export default reposSlice.reducer;