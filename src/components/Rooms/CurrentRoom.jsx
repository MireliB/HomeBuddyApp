import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import { Box, Button, Snackbar } from "@mui/material";

import { tokens } from "../../Theme";

// TODO
// הוספת פעולות אחרונות בDASHBOARD - לגרום לזה לעבוד 
// להתחיל לעבוד על דף הלקוחות 
// לקשר API אמיתי למכשירים כגון מזגן טלויזיה וכדומה - לפענח איך לגרום להכל להתחבר בצורה מאובטחת וטובה 
// בעמוד של הלקוחות להוסיף חיפוש לכל קטגוריה, לדוגמה שם לקוח, מכשיר, טלפון, סטטוס, פעולות
// לעבוד על הפיננסים באתר, להתחיל לבצע חישובים בהתאם, 
// לפענח איך לקשר חשבון ולשלם תשלום חודשי קבוע בתאריך קבוע 
// לסדר את ההתחברות של GOOGLE AUTH בצורה תקינה 
// להוסיף בSIGN UP - המשך הרשמה עם מס' טלפון, כתובת, ת.ז וכדומה 
// להוסיף עמוד של היסטוריית פעולות
// להוסיף אפשרות גם של ביטול תשלום וזיכוי במידת הצורך לאחר שנוסיף את ביצוע אפשרות התשלום
// לשבת עם פאמפקין על הלוגו העיצובי לאתר של הADMIN - לרשום HOME BUDDY - ADMIN 
// להוסיף עמוד של היסטוריית פעולות - מה עשינו באתר, מה הוספנו, מה מחקנו, מה שינינו
// להוסיף כפתורי פלטור
// להוסיף בדף של הלקוחות גם משתמשים חדשים שנרשמו, משתמשים, ביטולים, לקוחות פעילים, לקוחות לא פעילים
// לעבוד על הרספונסיביות של האתר שיותאם גם לטלפון לפי מסך, למחשב, טאבלט, טלפון וכדומה
import Search from "../Global/Search";
import RoomDetails from "./RoomDetails/RoomDetails";
import RoomList from "./RoomList/RoomList";
import Header from "../Header";

export function CurrentRoom({
  onAddRoom,
  rooms = [],
  devices,
  selectedRoom,
  setSelectedRoom,
  loading,
  deviceStatus,
  toggleDeviceStatus,
  handleBackToRooms,
  handleOpenPopup,
  isPopupOpen,
  setIsPopupOpen,
  handleRoomSelection,
  confirmDelete,
  message,
  setMessage,
}) {
  const nav = useNavigate();

  const theme = useTheme();

  const colors = tokens(theme.palette.mode);

  const [searchQuery, setSearchQuery] = useState("");

  const lowerCaseQuery = useMemo(
    () => searchQuery.toLowerCase().trim(),
    [searchQuery]
  );
  
  const filteredRooms = useMemo(() => {
    return (rooms ?? []).filter((room) => {
      const matchesRoomName = room?.name?.toLowerCase().includes(lowerCaseQuery);
      const matchesRoomType = room?.roomType?.toLowerCase()?.includes(lowerCaseQuery) || false;
  
      const matchesDevices = (devices ?? []).some(
        (device) =>
          device?.room === room?._id &&
          device?.name?.toLowerCase()?.includes(lowerCaseQuery)
      );
  
      return matchesRoomName || matchesRoomType || matchesDevices;
    });
  }, [rooms, devices, lowerCaseQuery]);
  

  const handleRoomEdit = async (room) => {
    if (!room || !room._id) return;
    nav(`/editRoom/${room._id}`, {
      state: { room },
    });
  };

  return (
    <Box m="2dvh">
      <Header
        title={"Rooms"}
        subtitle={
          "This space allows you to create and manage rooms, providing you with control over various technologies within your home."
        }
      />
      <Search setSearchQuery={setSearchQuery} />
      
      {selectedRoom ? (
        <RoomDetails
          isPopupOpen={isPopupOpen}
          selectedRoom={selectedRoom}
          setSelectedRoom={setSelectedRoom}
          setIsPopupOpen={setIsPopupOpen}
          handleOpenPopup={handleOpenPopup}
          confirmDelete={confirmDelete}
          handleBackToRooms={handleBackToRooms}
          devices={devices}
          loading={loading}
          deviceStatus={deviceStatus}
          toggleDeviceStatus={toggleDeviceStatus}
          handleRoomEdit={handleRoomEdit}
        />
      ) : (
        <RoomList
          rooms={filteredRooms}
          handleRoomSelection={handleRoomSelection}
          colors={colors}
          devices={devices}
        />
      )}

      {!selectedRoom && (
        <Button
          variant="contained"
          style={{ marginTop: "2dvh" }}
          onClick={onAddRoom}
        >
          + Add A Room
        </Button>
      )}

      <Snackbar
        open={message?.show}
        autoHideDuration={3000}
        onClose={() => setMessage({ ...message, show: false })}
        message={
          <span style={{ color: message?.color || "black" }}>
            {message.color === "green" ? (
              <CheckCircleOutline />
            ) : (
              <ErrorOutline />
            )}
            {message?.text}
          </span>
        }
      />
    </Box>
  );
}