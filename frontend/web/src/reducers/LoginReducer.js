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
    loading: 'idle',
    githubLoginRes: {},
    error: '',
}

const loginSlice = createSlice({
    name: 'login',
    initialState,
    reducers: {},
    // extraReducers: (builder) => {
    //     builder.addCase(githubLoginAsyc.pending, (state, action) => {
    //         state.loading = 'loading'
    //         state.githubLoginRes = {}
    //     }).addCase(githubLoginAsyc.fulfilled, (state, { payload }) => {
    //         state.loading = 'loaded'
    //         state.githubLoginRes = payload
    //     }).addCase(githubLoginAsyc.rejected, (state, action) => {
    //         state.loading = "error";
    //         state.error = action.error.message;
    //     })
    // },
})

export const loginProducts = createSelector(
    (state) => ({
       login: state.login,
       loading: state.login.loading,
       error: state.login.error,
    }), (state) =>  state
  );

export default loginSlice.reducer;