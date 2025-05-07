import { ColorModeContext, useMode } from "./Theme.js";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import SideDrawer from "./components/Global/SideDrawer.jsx";
import Dashboard from "./components/Dashboard/Dashboard.jsx";
import Finances from "./components/Finances/Finances.jsx";
import Settings from "./components/Settings/Settings.jsx";
import RoomsPage from "./components/Rooms/RoomsPage.jsx";
import Signup from "./components/SignUpPage/Signup.jsx";
import AboutUs from "./components/AboutUs/AboutUs.jsx";
import Login from "./components/LoginPage/Login.jsx";
import Room from "./components/Rooms/Room.jsx";
import Top from "./components/Global/Top.jsx";
import AddRoom from "./components/Rooms/AddRoom/AddRoom.jsx";
import Profile from "./components/UserProfile/Profile.jsx";

import useApp from "./Hooks/useApp.js";
import EditRoom from "./components/Rooms/EditRoom.jsx";
import ForgotPassword from "./components/LoginPage/ForgotPassword/ForgotPassword.jsx";
import ResetPassword from "./components/LoginPage/ResetPassword/ResetPassword.jsx";
import Clients from "./components/Clients/Clients.jsx";
import Statistics from "./components/Statistics/Statistics.jsx";

function App() {
  const [theme, colorMode] = useMode();

  const {
    onSubmitLogin,
    handleLogout,
    isLoggedIn,
    setIsSidebarOpen,
    userEmail,
    handleBackToRooms,
    selectedRoom,
    setSelectedRoom,
    loading,
    deviceStatus,
    toggleDeviceStatus,
    handleRoomEdit,
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
  } = useApp();

  const renderRouterPaths = () => {
    if (!isLoggedIn) {
      return (
        <>
          <Route path="/login" element={<Login onLogin={onSubmitLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="*" element={<Navigate to="/login" />} />
        </>
      );
    } else {
      return (
        <>
          <Route
            path="/dashboard"
            element={
              <Dashboard
                userEmail={userEmail}
                isLoggedIn={isLoggedIn}
                username={username}
                setUsername={setUsername}
              />
            }
          />
          <Route path="/leaderboard" element={<Statistics />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route
            path="/roomsPage"
            element={
              <RoomsPage
                handleBackToRooms={handleBackToRooms}
                selectedRoom={selectedRoom}
                setSelectedRoom={setSelectedRoom}
                loading={loading}
                deviceStatus={deviceStatus}
                toggleDeviceStatus={toggleDeviceStatus}
                handleRoomEdit={handleRoomEdit}
                handleOpenPopup={handleOpenPopup}
                isPopupOpen={isPopupOpen}
                setIsPopupOpen={setIsPopupOpen}
                handleRoomSelection={handleRoomSelection}
                confirmDelete={confirmDelete}
                message={message}
                setMessage={setMessage}
              />
            }
          />
          <Route path="/addRoom" element={<AddRoom />} />
          <Route path="/room" element={<Room />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/editRoom/:roomId" element={<EditRoom />} />
          <Route path="/userProfile/:userId" element={<Profile />} />
          <Route path="/clients" element={<Clients />} />
        </>
      );
    }
  };

  const renderTopHeader = () => {
    if (isLoggedIn) {
      return <SideDrawer isLoggedIn={isLoggedIn} onLogout={handleLogout} />;
    } else {
      return null;
    }
  };

  return (
    <BrowserRouter>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {renderTopHeader()}
            <main className="content" style={{ flex: 1 }}>
              {isLoggedIn && 
            <Top 
              setIsSidebar={setIsSidebarOpen} 
              onLogout={handleLogout} 
              isLoggedIn={isLoggedIn} 
              username={username} 
              userEmail = {userEmail}
              userRole = {userRole} 
              setUserRole = {setUserRole}
            />
              
              }
              <Routes>{renderRouterPaths()}</Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </BrowserRouter>
  );
}

export default App;
