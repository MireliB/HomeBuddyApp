import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  devices: [],
  loading: false,
  error: null,
};

const findDeviceByIndexName = (device, deviceName) => {
  return device.findIndex((device) => device.deviceName === deviceName);
};

const filteredDeviceFromRoom = (device, deviceId) => {
  return device.devices.filter((device) => device.deviceId !== deviceId);
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
      const { deviceName, device } = action.payload;
      const deviceIndex = findDeviceByIndexName(state.devices, deviceName);
      if (deviceIndex !== -1) {
        const updateDevices = filteredDeviceFromRoom(
          state.devices[deviceIndex],
          device.deviceId
        );
        state.devices[deviceIndex].devices = [...updateDevices];
      }
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

export const { setDevices, addDevice, deleteDevices, editDeviceSuccess } =
  deviceSlice.actions;

export const editDevice = (device) => async (dispatch) => {};
export default deviceSlice.reducer;
