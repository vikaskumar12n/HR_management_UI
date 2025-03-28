import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      console.log("Token from login action:", action.payload.token);
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
   
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
   
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
