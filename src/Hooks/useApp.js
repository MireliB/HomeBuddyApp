import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { deleteRoom } from "../slice/roomSlice";
import { deleteDevice, setDevices } from "../slice/deviceSlice";

import Cookies from 'js-cookie'
import axios from "axios";

const useApp = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadDevice, setLoadDevice] = useState({});
  const [message, setMessage] = useState({ show: false, text: "", color: "" });
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const [userEmail, setUserEmail] = useState(() => {
    const storedUserEmail = Cookies.get("userEmail");
    return storedUserEmail || "";
  });
  const [username, setUsername] = useState(() => {
    const storedUsername = Cookies.get("username");
    return storedUsername || "";
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedIsLoggedIn = Cookies.get("isLoggedIn");

    return storedIsLoggedIn ? JSON.parse(storedIsLoggedIn) : null;
  });

  const [userRole, setUserRole] = useState(()=>{
    const storedUserRole = Cookies.get("userRole");

    return storedUserRole ? storedUserRole : false;
  })

  const { devices } = useSelector((state) => state.devices);

  const [deviceStatus, setDeviceStatus] = useState(
    devices.reduce((acc, device) => {
      acc[device._id] = device.status;

      return acc;
    }, {})
  );

  const dispatch = useDispatch();

  const handleRoomSelection = (room) => setSelectedRoom(room);

  const handleBackToRooms = () => setSelectedRoom(null);

  const toggleDeviceStatus = (device) => {
    setLoadDevice((prevState) => ({
      ...prevState,
      [device._id]: true,
    }));

    const newStatus = deviceStatus[device._id] === "OFF" ? "ON" : "OFF";

    setTimeout(async () => {
      try {
        await updateDeviceStatus(device._id, newStatus);
        setDeviceStatus((prevState) => ({
          ...prevState,
          [device._id]: newStatus,
        }));
        setMessage({
          show: true,
          text: `Device ${device.name} turned ${newStatus}`,
          color: newStatus === "on" ? "green" : "red",
        });
      } catch (err) {
        console.error("Error updating device status: ", err);
      } finally {
        setLoadDevice((prevState) => ({
          ...prevState,
          [device._id]: false,
        }));
      }
    }, 1000);
  };

  const updateDeviceStatus = async (deviceId, status) => {
    const token = Cookies.get("token");

    await axios.put(
      `http://localhost:4000/device/${deviceId}`,
      {
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };
 
    const handleOpenPopup = (room) => {
      setSelectedRoom(room);
      setIsPopupOpen(true);
    };
  
    const confirmDelete = async () => {
      if (selectedRoom && selectedRoom._id) {
        await handleDeleteRoom();
        setIsPopupOpen(false);
        setSelectedRoom(null);
      }
    };
  
    const handleDeleteRoom = async () => {
      if (!selectedRoom || !selectedRoom._id) return;
  
      const roomId = selectedRoom._id;
      const token = Cookies.get("token");
  
      if (!token) {
        console.error("No Token found. Please log in again.");
        return;
      }
  
      try {
        const response = await axios.delete(
          `http://localhost:4000/room/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Room deleted successfully", response.data);
  
        dispatch(deleteRoom({ roomId }));

        const devicesToDelete = devices.filter(device => device.room === roomId);
        for (const device of devicesToDelete) {
          await axios.delete(`http://localhost:4000/device/${device._id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          dispatch(deleteDevice(device._id)); 
        }
    
        const updateDevices = devices.filter((device) => device.room !== roomId);
        dispatch(setDevices(updateDevices));
  
        setMessage({
          show: true,
          text: "Room deleted successfully",
          color: "red",
        });
  
        handleBackToRooms();
      } catch (err) {
        console.error("Error Deleting Room:", err);
      }
    };
    
  useEffect(() => {
    const token = Cookies.get("token");

    if (token) {
      let todayDate = Date.now();
      const loginTime = JSON.parse(Cookies.get("loginTime"));
      const expirationLoginTime = 8 * 60 * 60 * 1000;

      if (loginTime && todayDate - loginTime < expirationLoginTime) {
        setIsLoggedIn(true);
        setUsername(Cookies.get("username"));
      } else {
        handleLogout();
      }
    }
  }, []);

  const onSubmitLogin = (email, username, role) => {
    let todayDate = Date.now();

    const finalRole = email === process.env.REACT_APP_MANAGER_EMAIL ? "manager" : role;
    
    Cookies.set("loginTime", JSON.stringify(todayDate));
    Cookies.set("isLoggedIn", JSON.stringify(true));
    Cookies.set("userEmail", email);
    Cookies.set("username", username);
    Cookies.set("userRole", finalRole);

    setUserEmail(email);
    setUsername(username);
    setUserRole(finalRole);
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);

    Cookies.remove("token");
    Cookies.remove("loginTime");
    Cookies.remove("isLoggedIn");
    Cookies.remove("userEmail");
    Cookies.remove("username");
    Cookies.remove("userRole");
    setUserRole(null);
  };

  return {
    onSubmitLogin,
    handleLogout,
    isLoggedIn,
    isSidebarOpen,
    setIsSidebarOpen,
     userEmail,
     setUserEmail,
     handleBackToRooms,
     selectedRoom,
     setSelectedRoom,
     loading,
     deviceStatus,
     toggleDeviceStatus,
     handleOpenPopup,
     isPopupOpen,
     setIsPopupOpen,
     handleRoomSelection,
     confirmDelete,
     message,
     setMessage,
     username,
     setUsername,
     userRole, 
     setUserRole
  };
};

export default useApp;
