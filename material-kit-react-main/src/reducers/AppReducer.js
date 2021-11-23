import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import Api from '../remotes/Api'

export const updateDashBoardAsyc = createAsyncThunk(
    'app/updateDashBoard',
    async (_, { rejectWithValue }) => {
        try {
            // const { id, ...fields } = props
            const response = await Api.fetchDashBoard()
            return response.data.code
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
    accessToken: null,
    updateDashBoard: false,
    error: null,
    loading: false
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setUpdateDashBoard: (state, action) => {
            state.updateDashBoard = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(updateDashBoardAsyc.pending, (state, action) => {
            state.loading = true;
            state.updateDashBoard = false;
        }).addCase(updateDashBoardAsyc.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.updateDashBoard = true;
        }).addCase(updateDashBoardAsyc.rejected, (state, action) => {
            state.loading = false;
            state.updateDashBoard = false;
            state.error = action.error.message;
        })
    },
})


export const { setAccessToken, setUpdateDashBoard } = appSlice.actions;

export const appProducts = createSelector(
    (state) => ({
        accessToken: state.app.accessToken,
        updateDashBoard: state.app.updateDashBoard
    }), (state) => state
);

export default appSlice.reducer;