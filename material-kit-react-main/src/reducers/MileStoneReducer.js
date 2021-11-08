import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import Api from '../remotes/Api'

export const fetchGithubUserRepoMilestonesAsync = createAsyncThunk(
    'milestone/fetchGithubUserRepoMilestones',
    async (props, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.fetchGithubUserRepoMilestones(props);
            return response.data
        } catch (err) {
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            // We got validation errors, let's return those so we can reference in our component and set form errors
            return rejectWithValue(error.response.data)
        }
    }
)

export const fetchGithubUserRepoMilestoneAsync = createAsyncThunk(
    'milestone/fetchGithubUserRepoMilestone',
    async (props, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.fetchGithubUserRepoMilestone(props);
            return response.data
        } catch (err) {
            let error = err // cast the error for access
            if (!error.response) {
                throw err
            }
            // We got validation errors, let's return those so we can reference in our component and set form errors
            return rejectWithValue(error.response.data)
        }
    }
)

const initialState = {
    milestones: [],
    milestone: null,
    loading: false,
    error: null
}

const milestoneSlice = createSlice({
    name: 'milestone',
    initialState,
    reducers: {
        setMileStones: (state, action) => {
            state.milestones = action.payload;
        },
        setMileStone: (state, action) => {
            state.milestone = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchGithubUserRepoMilestonesAsync.pending, (state, action) => {
            state.loading = true;
            state.milestones = [];
            state.error = null;
        }).addCase(fetchGithubUserRepoMilestonesAsync.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.milestones = payload;
            state.error = null;
        }).addCase(fetchGithubUserRepoMilestonesAsync.rejected, (state, action) => {
            state.loading = false;
            state.milestones = [];
            state.error = action.payload;
        }).addCase(fetchGithubUserRepoMilestoneAsync.pending, (state, action) => {
            state.loading = true;
            state.milestone = null;
            state.error = null;
        }).addCase(fetchGithubUserRepoMilestoneAsync.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.milestone = payload;
            state.error = null;
        }).addCase(fetchGithubUserRepoMilestoneAsync.rejected, (state, action) => {
            state.loading = false;
            state.milestone = null;
            state.error = action.payload;
        })
    },
})

export const { setMileStones, setMileStone } = milestoneSlice.actions;

export const milestoneProducts = createSelector(
    (state) => ({
        milestones: state.milestone.milestones,
        milestone: state.milestone.milestone,
        milestoneLoading: state.milestone.loading,
        milestoneError: state.milestone.error,
    }), (state) => state
);

export default milestoneSlice.reducer;