import { Box, Divider, Stack, Typography } from '@mui/material'
import React from 'react'

export default function AvailableRooms({isDarkMode, colors, rooms}) {
  return (
    <Box
    gridColumn={"span 1 "}
    gridRow={"span 1"}
    width={"100%"}
    flexDirection={"column"}
    backgroundColor={isDarkMode ? colors.primary[400] : colors.grey[900]}
    borderRadius={"10px"}
  >
    <Box
      elevation={3}
      style={{
        padding: "16px",
        backgroundColor: isDarkMode
          ? colors.primary[400]
          : colors.grey[900],
        borderRadius: "10px",
      }}
    >
      <Box height={"208px"}>
        <Typography
          variant="h5"
          fontWeight={"bold"}
          color={colors.grey[100]}
        >
          Available Rooms
        </Typography>

        <Divider style={{ marginBottom: "16px" }} />
        <Stack spacing={2}>
          <Typography
            variant="h3"
            fontWeight={"500"}
            color={
              isDarkMode ? colors.greenAccent[500] : colors.primary[100]
            }
          >
            {rooms.length
              ? rooms.map((room, index) => (
                  <Box>
                    <Typography key={index} fontWeight={"bold"}>
                      Room Name: {room.name}, Room Type: {room.roomType}
                    </Typography>
                  </Box>
                ))
              : "No Available Rooms"}
          </Typography>
        </Stack>
      </Box>
    </Box>
  </Box>
  )
}
