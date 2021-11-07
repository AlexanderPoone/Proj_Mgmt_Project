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
const initialState = {
    repos: [],
    repo: null,
    loading: false,
    error: null
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
        })
    },
})


export const { setRepos, setRepo } = reposSlice.actions;

export const reposProducts = createSelector(
    (state) => ({
        repos: state.repo.repos,
        repo: state.repo.repo,
        reposLoading: state.repo.loading,
        reposError: state.repo.error,
    }), (state) => state
);

export default reposSlice.reducer;