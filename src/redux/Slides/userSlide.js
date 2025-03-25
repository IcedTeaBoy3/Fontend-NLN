import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  avatar: "",
  access_token: "",
  isAdmin: false,
  city: "",
  refresh_token: "",
};

const userSlide = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    updateUser: (state, action) => {
      const { _id, name, email, phone, address, avatar, access_token, isAdmin, city, refresh_token } = action.payload;
      state._id = _id;
      state.name = name;
      state.email = email;
      state.phone = phone;
      state.address = address;
      state.avatar = avatar;
      state.access_token = access_token;
      state.isAdmin = isAdmin;
      state.city = city;
      state.refresh_token = refresh_token;
    },
    resetUser: () => initialState,
  },
});

export const { updateUser, resetUser } = userSlide.actions;
export default userSlide.reducer;
