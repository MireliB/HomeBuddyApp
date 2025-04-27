import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  devices: [],
  loading: false,
  error: null,
};

const deviceSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    setDevices: (state, action) => {
      state.devices = action.payload;
    },

    addDevice: (state, action) => {
      state.devices.push(action.payload);
    },

    deleteDevice: (state, action) => {
      const deviceId = action.payload;
      state.devices = state.devices.filter(device=> device._id !== deviceId)
    },

    editDeviceSuccess: (state, action) => {
      const { _id, name, status } = action.payload;
      const index = state.devices.findIndex((device) => device._id === _id);
      if (index !== -1) {
        state.devices[index] = { ...state.devices[index], name, status };
      }
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setDevices, addDevice, deleteDevice, editDeviceSuccess } = deviceSlice.actions;

export const editDevice = (device) => async (dispatch) => {};
export default deviceSlice.reducer;
