import React, { useEffect, useState } from "react";
import classes from "./Room.module.css";
// import Device from "../RoomDevices/Device";

export default function Room({ room }) {
  const [devices, setDevices] = useState(room ? room.devices : []);

  // will be shown in every click by room
  useEffect(() => {
    if (room) {
      setDevices(room.devices);
    } else {
      setDevices([]);
    }
  }, [room]);
  return (
    <div className={classes["room-container"]}>
      <div className={classes["room-title"]}>{room ? room.roomName : ""}</div>
      <div className={classes["room-subtitle"]}>
        <span
          className={classes["room-subtitle"]}
          style={{ alignSelf: "flex-end" }}
        >
          {/* need to add roomTemp to slice */}
          {room ? room.roomTemp : ""}
        </span>
      </div>
      {devices.map((roomLabel, index) => (
        <div>{roomLabel}</div>
      ))}
      <div>
        <button>Actions</button>
      </div>
      <table>
        {/* {devices.map((device, index) => (
          <Device
            isLast={index === devices.length - 1}
            key={"Device List" + device.deviceName}
            device={device}
            deviceName={device.deviceName}
          />
        ))} */}
      </table>
    </div>
  );
}
