import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import Api from '../remotes/Api'

export const fetchGithubUserAsync = createAsyncThunk(
    'user/fetchGithubUser',
    async (_, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.fetchGithubUser()
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

export const fetchContributorObjAsync = createAsyncThunk(
    'user/fetchContributorObjAsync',
    async (props, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.fetchContributors(props)
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

export const assignTeamAsync = createAsyncThunk(
    'user/assignTeamAsync',
    async (props, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.assignTeam(props);
            console.log('assignTeamAsync response:', JSON.stringify(response.data));
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
    user: null,
    contributorObj: null,
    assignTeamObj: null,
    loading: false,
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        setContributorObj: (state, action) => {
            state.contributorObj = action.payload;
        },
        setAssignTeamObj: (state, action) => {
            state.assignTeamObj = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchGithubUserAsync.pending, (state, action) => {
            state.loading = true;
            state.user = null;
            state.error = null;
        }).addCase(fetchGithubUserAsync.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.user = payload;
            state.error = null;
        }).addCase(fetchGithubUserAsync.rejected, (state, action) => {
            state.loading = false;
            console.log('action.error:', action.error);
            state.error = action.payload;
        }).addCase(fetchContributorObjAsync.pending, (state, action) => {
            state.loading = true;
            state.contributorObj = null;
            state.error = null;
        }).addCase(fetchContributorObjAsync.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.contributorObj = payload;
            state.error = null;
        }).addCase(fetchContributorObjAsync.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.contributorObj = null;
        }).addCase(assignTeamAsync.pending, (state, action) => {
            state.loading = true;
            state.assignTeamObj = null;
            state.error = null;
        }).addCase(assignTeamAsync.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.assignTeamObj = payload;
            state.error = null;
        }).addCase(assignTeamAsync.rejected, (state, action) => {
            state.loading = false;
            state.assignTeamObj = null;
            state.error = action.payload;
        })
    },
})


export const { setUser } = userSlice.actions;

export const userProducts = createSelector(
    (state) => ({
        user: state.user.user,
        contributorObj: state.user.contributorObj,
        userLoading: state.user.loading,
        userError: state.user.error,
        assignTeamObj: state.user.assignTeamObj
    }), (state) => state
);

export default userSlice.reducer;