import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import Api from '../remotes/Api'

// export const githubLoginAsyc = createAsyncThunk(
//     'login/githubLogin',
//     async (_, { rejectWithValue }) => {
//         try {
//             // const { id, ...fields } = props
//             const response = await Api.githubLogin()
//             return response.data.code
//         } catch (err) {
//             let error = err // cast the error for access
//             if (!error.response) {
//                 throw err
//             }
//             // We got validation errors, let's return those so we can reference in our component and set form errors
//             return rejectWithValue(error.response.data)
//         }
//     }
// )

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
    // extraReducers: (builder) => {
    //     builder.addCase(githubLoginAsyc.pending, (state, action) => {
    //         state.loading = true
    //         state.githubLoginRes = {}
    //     }).addCase(githubLoginAsyc.fulfilled, (state, { payload }) => {
    //         state.loading = false
    //         state.githubLoginRes = payload
    //     }).addCase(githubLoginAsyc.rejected, (state, action) => {
    //         state.loading = false;
    //         state.error = action.error.message;
    //     })
    // },
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