import React, { useState, useEffect } from "react";
import Header from "../Header";
import {
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  TextField,
  CircularProgress,
  IconButton,
  Tooltip,
  Snackbar,
  DialogActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  useTheme,
} from "@mui/material";
import Search from "../Global/Search";

import { Edit, Delete } from "@mui/icons-material";
import { tokens } from "../../Theme";
import useClients from "../../Hooks/useClients";
// להוסיף בדף של הלקוחות גם משתמשים חדשים שנרשמו, משתמשים, ביטולים, לקוחות פעילים, לקוחות לא פעילים

const Clients = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDarkMode = theme.palette.mode === "dark";

  const {
    clients,
    setClients,
    editClientData,
    setEditClientData,
    openSnackbar,
    setOpenSnackbar,
    token,
    statistics,
    setStatistics,
    filteredClients,
    setFilteredClients,
    searchQuery,
    setSearchQuery,
    loading,
    setLoading,
    handleEditSubmit,
    fetchClients,
    deleteClient,
    fetchStatiscitcs,
  } = useClients();

  const handleEditClick = (client) => {
    setEditClientData(client);
  };

  useEffect(() => {
    fetchClients();
    fetchStatiscitcs();
  }, []);

  useEffect(() => {
    const lowerSearch = searchQuery.toLowerCase();
    setFilteredClients(
      clients.filter(
        (client) =>
          client.username.toLowerCase().includes(lowerSearch) ||
          client.email.toLowerCase().includes(lowerSearch)
      )
    );
  }, [clients, searchQuery]);

  return (
    <Box p={2}>
      <Header
        title="Clients"
        subtitle="List of clients connected to the system."
      />
      <Search setSearchQuery={setSearchQuery} /> <br />
      <Box
        style={{
          padding: "16px",
          backgroundColor: isDarkMode ? colors.primary[400] : colors.grey[900],
          borderRadius: "10px",
        }}
      >
        {statistics && (
          <Box display="flex" gap={2} mb={2} flexWrap="wrap">
            <Paper
              sx={{ p: 2 }}
              style={{
                backgroundColor: isDarkMode
                  ? colors.primary[400]
                  : colors.grey[900],
              }}
            >
              <strong>Total Users:</strong> {statistics.totalUsers}
            </Paper>
            <Paper
              sx={{ p: 2 }}
              style={{
                backgroundColor: isDarkMode
                  ? colors.primary[400]
                  : colors.grey[900],
              }}
            >
              <strong>New Users This Week:</strong> {statistics.newUsers}
            </Paper>
            {/* <Paper
              sx={{ p: 2 }}
              style={{
                backgroundColor: isDarkMode
                  ? colors.primary[400]
                  : colors.grey[900],
              }}
            >
              <strong>Total Active Users:</strong> {statistics.activeUsers}
            </Paper> */}
            {/* <Paper
              sx={{ p: 2 }}
              style={{
                backgroundColor: isDarkMode
                  ? colors.primary[400]
                  : colors.grey[900],
              }}
            >
              <strong>Total Inactive Users:</strong> {statistics.inactiveUsers}
            </Paper> */}
            {/* <Paper
              sx={{ p: 2 }}
              style={{
                backgroundColor: isDarkMode
                  ? colors.primary[400]
                  : colors.grey[900],
              }}
            >
              <strong>Total Canceled:</strong> {statistics.canceledUsers}
            </Paper> */}
          </Box>
        )}

        {loading ? (
          <CircularProgress />
        ) : (
          <Paper sx={{ p: 2 }}
          style={{
            backgroundColor: isDarkMode
              ? colors.primary[400]
              : colors.grey[900],
          }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  {/* <TableCell>Active Users</TableCell> */}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow key={client._id}>
                    <TableCell>{client.username}</TableCell>
                    <TableCell>{client.email}</TableCell>
                    <TableCell>{client.role}</TableCell>
                    <TableCell>{client.active}</TableCell>
                    <TableCell>
                      <Tooltip title="Edit">
                        <IconButton onClick={() => handleEditClick(client)}>
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => deleteClient(client._id)}
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        {/* Edit Dialog */}
        <Dialog
          open={Boolean(editClientData)}
          onClose={() => setEditClientData(null)}
        >
          <DialogTitle>Edit Client</DialogTitle>
          <DialogContent>
            <TextField
              label="Username"
              fullWidth
              margin="dense"
              value={editClientData?.username || ""}
              onChange={(e) =>
                setEditClientData({
                  ...editClientData,
                  username: e.target.value,
                })
              }
            />
            <TextField
              label="Email"
              fullWidth
              margin="dense"
              value={editClientData?.email || ""}
              onChange={(e) =>
                setEditClientData({ ...editClientData, email: e.target.value })
              }
            />
            <TextField
              label="Role"
              fullWidth
              margin="dense"
              value={editClientData?.role || ""}
              onChange={(e) =>
                setEditClientData({ ...editClientData, role: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditClientData(null)}>Cancel</Button>
            <Button onClick={handleEditSubmit} variant="contained">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={openSnackbar.open}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar({ ...openSnackbar, open: false })}
          message={openSnackbar.message}
          ContentProps={{
            style: {
              backgroundColor: openSnackbar.color === "green" ? "green" : "red",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Clients;
