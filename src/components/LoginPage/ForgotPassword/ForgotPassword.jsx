import React, {useState} from 'react'; 
import {Box, Button, TextField, Typography, useTheme} from '@mui/material';
import axios from 'axios';
const ForgotPassword = ()=>{

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async() =>{
        try{
          const response = await axios.post(
            "http://localhost:4000/forgot-password",
            { email }
          );
          setMessage(response.data.message);
        }catch(err){
            console.error(err);
            setMessage(err.response?.data?.message || "Something went wrong.");
        }
    }
    return (
      <Box p={4}>
        <Typography variant="h5">Forgot Password</Typography>
        <TextField
          fullWidth
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
          Send Reset Link
        </Button>

        {message && <Typography mt={2}>{message}</Typography>}
      </Box>
    );
}

export default ForgotPassword;