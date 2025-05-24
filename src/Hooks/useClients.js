import axios from 'axios';
import React, {useState} from 'react'

const useClients = ()=> {
  const [clients, setClients] = useState([]);
  const [editClientData, setEditClientData] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState({
    open: false,
    message: "",
    color: "green",
  });

const [statistics, setStatistics] = useState(null);
const [filteredClients, setFilteredClients] = useState([]);
const [searchQuery, setSearchQuery] = useState("");
const [loading, setLoading] = useState(true);
const [selectedUser, setSelectedUser] = useState(null);
const [isPopupOpen, setIsPopupOpen] = useState(false);

const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];

  const handlePopupOpen = (client) =>{
    setSelectedUser(client); 
    setIsPopupOpen(true);
  };

  const confirmDeleteUser = async ()=>{
    if(!selectedUser) return;  
      await deleteClient(selectedUser);
      setIsPopupOpen(false);
      setSelectedUser(null);
    
  }

    const handleEditSubmit = async () => {
        try {
          const response = await axios.put(
            `http://localhost:4000/clients/${editClientData._id}`,
            editClientData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setClients((prev) =>
            prev.map((client) =>
              client._id === editClientData._id ? response.data : client
            )
          );
    
          setEditClientData(null);
          setOpenSnackbar({
            open: true,
            message: "Client updated successfully",
            color: "green",
          });
        } catch (err) {
          console.error("Failed to update client:", err);
          setOpenSnackbar({
            open: true,
            message: "Client update failed",
            color: "red",
          });
        }
      };

       const fetchClients = async () => {
          try {
            const response = await axios.get("http://localhost:4000/clients", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            setClients(response.data);
            setFilteredClients(response.data);
          } catch (err) {
            console.error("Failed to fetch clients:", err);
          } finally {
            setLoading(false);
          }
        };
      
        const deleteClient = async (clientId) => {
          try {
            await axios.delete(`http://localhost:4000/clients/${clientId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
      
            setClients(clients.filter((client) => client._id !== clientId));
            setOpenSnackbar({
              open: true,
              message: "Client deleted successfully",
              color: "green",
            });
          } catch (err) {
            console.error("Failed to delete client:", err);
            setOpenSnackbar({
              open: true,
              message: "Client delete failed",
              color: "red",
            });
          }
        };
      
        const fetchStatiscitcs = async ()=>{
          try{
            const response = await axios.get(
              "http://localhost:4000/clients/statistics",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            setStatistics(response.data);
          }catch(err){
          }
        }
  return {
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
    handlePopupOpen,
    isPopupOpen,
    setIsPopupOpen,
    selectedUser,
    setSelectedUser,
    confirmDeleteUser
  }
}

export default useClients; 