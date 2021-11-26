import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import { start } from 'nprogress';
import { store } from 'src/store';
import Api from '../remotes/Api'
import { fetchRepoAsync } from './RepoReducer';

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

export const confirmTaskAsync = createAsyncThunk(
    'issue/confirmTaskAsync',
    async (props, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.confirmIssue(props);
            // store.dispatch(fetchRepoAsync(props));
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

export const delayTaskAsync = createAsyncThunk(
    'issue/delayTaskAsync',
    async (props, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.delayIssue(props);
            // store.dispatch(fetchRepoAsync(props));
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

export const rejectTaskAsync = createAsyncThunk(
    'issue/rejectTaskAsync',
    async (props, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.rejectIssue(props);
            // store.dispatch(fetchRepoAsync(props));
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

export const resolveTaskAsync = createAsyncThunk(
    'issue/resolveTaskAsync',
    async (props, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.resolveIssue(props);
            // store.dispatch(fetchRepoAsync(props));
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

export const reassignTaskAsync = createAsyncThunk(
    'issue/reassignTask',
    async (props, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.reassignIssue(props);
            // store.dispatch(fetchRepoAsync(props));
            console.log('reassignTask:', response.data);
            return response.data
        } catch (err) {
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            // We got validation errors, let's return those so we can reference in our component and set form errors
            console.log('reassignTask.error:', error.response.data);
            return rejectWithValue(error.response.data)
        }
    }
)

const initialState = {
    issues: [],
    issue: null,
    loading: false,
    confirmTask: null,
    delayTask: null,
    rejectTask: null,
    resolvedTask: null,
    reassignUser: null,
    
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
        },
        setConfirmTask: (state, action) => {
            state.confirmTask = action.payload;
        },
        setDelayTask: (state, action) => {
            state.delayTask = action.payload;
        },
        setRejectTask: (state, action) => {
            state.rejectTask = action.payload;
        },
        setResolvedTask: (state, action) => {
            state.resolvedTask = action.payload;
        },
        setReassignUser: (state, action) => {
            state.reassignUser = action.payload;
        },
        setIssueLoading: (state, action) => {
            state.loading = action.payload;
        },
        setIssueError: (state, action) => {
            state.error = action.payload;
        },
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
            state.error = action.error;
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
            state.error = action.error;
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
            state.error = action.error;
        }).addCase(confirmTaskAsync.pending, (state, action) => {
            state.loading = true;
            state.confirmTask = null;
            state.rejectTask = null;
            state.delayTask = null;
            state.resolvedTask = null;
            state.error = null;
        }).addCase(confirmTaskAsync.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.confirmTask = payload;
            state.error = null;
        }).addCase(confirmTaskAsync.rejected, (state, action) => {
            state.loading = false;
            state.confirmTask = null;
            state.rejectTask = null;
            state.delayTask = null;
            state.resolvedTask = null;
            state.error = action.error;
        }).addCase(delayTaskAsync.pending, (state, action) => {
            state.loading = true;
            state.confirmTask = null;
            state.rejectTask = null;
            state.delayTask = null;
            state.resolvedTask = null;
            state.error = null;
        }).addCase(delayTaskAsync.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.delayTask = payload;
            state.error = null;
        }).addCase(delayTaskAsync.rejected, (state, action) => {
            state.loading = false;
            state.confirmTask = null;
            state.rejectTask = null;
            state.delayTask = null;
            state.resolvedTask = null;
            state.error = action.error;
        }).addCase(rejectTaskAsync.pending, (state, action) => {
            state.loading = true;
            state.confirmTask = null;
            state.rejectTask = null;
            state.delayTask = null;
            state.resolvedTask = null;
            state.error = null;
        }).addCase(rejectTaskAsync.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.rejectTask = payload;
            state.error = null;
        }).addCase(rejectTaskAsync.rejected, (state, action) => {
            state.loading = false;
            state.confirmTask = null;
            state.rejectTask = null;
            state.delayTask = null;
            state.resolvedTask = null;
            state.error = action.error;
        }).addCase(resolveTaskAsync.pending, (state, action) => {
            state.loading = true;
            state.confirmTask = null;
            state.rejectTask = null;
            state.delayTask = null;
            state.resolvedTask = null;
            state.error = null;
        }).addCase(resolveTaskAsync.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.resolvedTask = payload;
            state.error = null;
        }).addCase(resolveTaskAsync.rejected, (state, action) => {
            state.loading = false;
            state.confirmTask = null;
            state.rejectTask = null;
            state.delayTask = null;
            state.resolvedTask = null;
            state.error = action.error;
        }).addCase(reassignTaskAsync.pending, (state, action) => {
            state.loading = true;
            state.reassignUser = null;
            state.error = null;
        }).addCase(reassignTaskAsync.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.reassignUser = payload;
            state.error = null;
        }).addCase(reassignTaskAsync.rejected, (state, action) => {
            state.loading = false;
            state.reassignUser = null;
            state.error = action.error;
        })


    },
})


export const {
    setIssue,
    setIssues,
    setConfirmTask,
    setDelayTask,
    setResolvedTask,
    setRejectTask,
    setReassignUser,
    setIssueLoading,
    setIssueError
} = issueSlice.actions;

export const issueProducts = createSelector(
    (state) => ({
        issues: state.issue.issues,
        issue: state.issue.issue,
        confirmTask: state.issue.confirmTask,
        delayTask: state.issue.delayTask,
        rejectTask: state.issue.rejectTask,
        resolvedTask: state.issue.resolvedTask,
        reassignUser: state.issue.reassignUser,
        issueLoading: state.issue.loading,
        issueError: state.issue.error,
    }), (state) => state
);

export default issueSlice.reducer;