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

const initialState = {
    user: null,
    loading: false,
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
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
        })
    },
})


export const { setUser } = userSlice.actions;

export const userProducts = createSelector(
    (state) => ({
        user: state.user.user,
        userLoading: state.user.loading,
        userError: state.user.error,
    }), (state) => state
);

export default userSlice.reducer;