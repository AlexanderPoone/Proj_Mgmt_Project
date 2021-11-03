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
    accessToken: ''
}

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
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


export const { setAccessToken } = appSlice.actions;

export const appProducts = createSelector(
    (state) => ({
        app: state.app
    }), (state) => state
);

export default appSlice.reducer;