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
import Homepage from "./components/Home/Homepage.jsx";
import Login from "./components/LoginPage/Login.jsx";
import Room from "./components/Rooms/Room.jsx";
import EditRoom from "./components/Rooms/EditRoom.jsx";
import Top from "./components/Global/Top.jsx";

import useApp from "./Hooks/useApp.js";
import AddRoom from "./components/Rooms/AddRoom/AddRoom.jsx";

function App() {
  const [theme, colorMode] = useMode();

  const { onSubmitLogin, handleLogout, isLoggedIn, setIsSidebarOpen } =
    useApp();

  const renderRouterPaths = () => {
    if (!isLoggedIn) {
      return (
        <>
          <Route path="/login" element={<Login onLogin={onSubmitLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      );
    } else {
      return (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/home" element={<Homepage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/roomsPage" element={<RoomsPage />} />
          <Route path="/addRoom" element={<AddRoom />} />
          <Route path="/room" element={<Room />} />
          <Route path="/aboutUs" element={<AboutUs />} />
          <Route path="/finances" element={<Finances />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/editRoom/:roomId" element={<EditRoom />} />
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
          <div className="app" style={{ display: "flex", height: "100vh" }}>
            {renderTopHeader()}
            <main className="content" style={{ flex: 1 }}>
              {isLoggedIn && <Top setIsSidebar={setIsSidebarOpen} />}
              <Routes>{renderRouterPaths()}</Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </BrowserRouter>
  );
}

export default App;
