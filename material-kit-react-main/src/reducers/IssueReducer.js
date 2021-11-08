import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { start } from 'nprogress';
import Api from '../remotes/Api'

export const fetchGithubUserRepoIssuesAsync = createAsyncThunk(
    'issue/fetchGithubUserRepoIssues',
    async (props, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.fetchGithubUserRepoIssues(props);
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

export const fetchGithubUserMileStoneIssuesAsync = createAsyncThunk(
    'issue/fetchGithubUserMileStoneIssuesAsync',
    async (props, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.fetchGithubUserMileStoneIssues(props);
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

export const fetchGithubUserRepoIssueAsync = createAsyncThunk(
    'issue/fetchGithubUserRepoIssueAsync',
    async (props, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.fetchGithubUserRepoIssue(props);
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
    issues: [],
    issue: null,
    loading: false,
    error: null
}

const issueSlice = createSlice({
    name: 'issue',
    initialState,
    reducers: {
        setIssues: (state, action) => {
            state.issues = action.payload;
        },
        setIssue: (state, action) => {
            state.issue = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchGithubUserRepoIssuesAsync.pending, (state, action) => {
            state.loading = true;
            state.issues = [];
            state.error = null;
        }).addCase(fetchGithubUserRepoIssuesAsync.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.issues = payload;
            state.error = null;
        }).addCase(fetchGithubUserRepoIssuesAsync.rejected, (state, action) => {
            state.loading = false;
            state.issues = [];
            state.error = action.payload;
        }).addCase(fetchGithubUserMileStoneIssuesAsync.pending, (state, action) => {
            state.loading = true;
            state.issues = [];
            state.error = null;
        }).addCase(fetchGithubUserMileStoneIssuesAsync.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.issues = payload;
            state.error = null;
        }).addCase(fetchGithubUserMileStoneIssuesAsync.rejected, (state, action) => {
            state.loading = false;
            state.issues = [];
            state.error = action.payload;
        }).addCase(fetchGithubUserRepoIssueAsync.pending, (state, action) => {
            state.loading = true;
            state.issue = null;
            state.error = null;
        }).addCase(fetchGithubUserRepoIssueAsync.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.issue = payload;
            state.error = null;
        }).addCase(fetchGithubUserRepoIssueAsync.rejected, (state, action) => {
            state.loading = false;
            state.issue = null;
            state.error = action.payload;
        })


    },
})


export const { setIssue, setIssues } = issueSlice.actions;

export const issueProducts = createSelector(
    (state) => ({
        issues: state.issue.issues,
        issue: state.issue.issue,
        issueLoading: state.issue.loading,
        issueError: state.issue.error,
    }), (state) => state
);

export default issueSlice.reducer;