import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { CheckCircleOutline, ErrorOutline } from "@mui/icons-material";
import { Box, Button, CircularProgress, Snackbar } from "@mui/material";

import { tokens } from "../../Theme";

// TODO
// לעבוד על העיצוב של הלקוחות - ולתקן את הפונקציות הנמצאות כגון עריכה ומחיקה
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
// לתקן את הalertsand notifications - שיציג את ההתראות פר משתמש
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
  isLoading,
  handleRoomEdit,
  editRoomData,
  setEditRoomData,
  isEditDialogOpen,
  setIsEditDialogOpen,
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
      const matchesRoomName = room?.name
        ?.toLowerCase()
        .includes(lowerCaseQuery);
      const matchesRoomType =
        room?.roomType?.toLowerCase()?.includes(lowerCaseQuery) || false;

      const matchesDevices = (devices ?? []).some(
        (device) =>
          device?.room === room?._id &&
          device?.name?.toLowerCase()?.includes(lowerCaseQuery)
      );

      return matchesRoomName || matchesRoomType || matchesDevices;
    });
  }, [rooms, devices, lowerCaseQuery]);

  // const handleRoomEdit = async (room) => {
  //   if (!room || !room._id) return;
  //   nav(`/editRoom/${room._id}`, {
  //     state: { room },
  //   });
  // };

  return (
    <Box m="2dvh">
      <Header
        title={"Rooms"}
        subtitle={
          "This space allows you to create and manage rooms, providing you with control over various technologies within your home."
        }
      />

      <Search setSearchQuery={setSearchQuery} />
      
      {!selectedRoom && (
        <Button
          variant="contained"
          style={{ marginTop: "3dvh", backgroundColor: "#3da58a" }}
          onClick={onAddRoom}
        >
          + Add A Room
        </Button>
      )}
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
          editRoomData={editRoomData}
          setEditRoomData={setEditRoomData}
          isEditDialogOpen={isEditDialogOpen}
          setIsEditDialogOpen={setIsEditDialogOpen}
        />
      ) : (
        <RoomList
          rooms={filteredRooms}
          handleRoomSelection={handleRoomSelection}
          colors={colors}
          devices={devices}
        />
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
