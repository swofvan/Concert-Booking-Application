// import { createSlice } from "@reduxjs/toolkit";

// export const authSlice = createSlice({
//     name: "auth",
//     initialState: {
//         user: null,       // Stores logged-in user info
//     },
//     reducers: {
//         setUser: (state, action) => {
//             state.user = action.payload;
//             state.error = null;
//         },
//         removeUser: (state) => {
//             state.user = null;
//             state.error = null;
//         },
//     }
// });

// export const { setUser, removeUser } = authSlice.actions;

// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem("user", JSON.stringify(action.payload));
        },

        removeUser: (state) => {
            state.user = null;
            localStorage.removeItem("user");
        },

        setUserFromLocalStorage: (state) => {
            const user = localStorage.getItem("user");
            state.user = user ? JSON.parse(user) : null;
        }
    }
}); 

export const {
    setUser,
    removeUser,
    setUserFromLocalStorage
} = authSlice.actions;

export default authSlice.reducer;
