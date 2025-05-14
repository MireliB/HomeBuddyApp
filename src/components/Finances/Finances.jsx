import React, { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import Header from "../Header";
import { tokens } from "../../Theme";

export default function Finances() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isDarkMode = theme.palette.mode === "dark";
  const [payments, setPayments] = useState([
    {
      id: 1,
      amount: 99.99,
      date: Date(),
      method: "Credit Card",
      user: "John Doe",
    },
    {
      id: 2,
      amount: 49.99,
      date: Date(),
      method: "Credit Card",
      user: "Alice Smith",
    },
  ]);

  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  
  useEffect(()=>{
    const months = Array.from({length: 12}, (_, index)=>({
      name: new Date(0,index).toLocaleString("default", {month: "short"}),
      Revenue: 0,
    }));

    payments.forEach((payment)=>{
      const monthIndex = new Date(payment.date).getMonth();
      months[monthIndex].Revenue += payment.amount;
    });

    setMonthlyRevenue(months);
  },[payments]);

  const totalRevenue = payments.reduce((acc, p)=> acc + p.amount, 0);

  return (
    <Box p={2}>
      <Header title="Finances" subtitle="Check Users Payments" />
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Grid
            style={{
              backgroundColor: isDarkMode
                ? colors.primary[400]
                : colors.grey[900],
            }}
          >
            <CardContent>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4">${totalRevenue.toFixed(2)}</Typography>
            </CardContent>
          </Grid>
          <br />
        </Grid>
      </Grid>
      <Grid item sx={12}>
        <Card>
          <CardContent
            style={{
              backgroundColor: isDarkMode
                ? colors.primary[400]
                : colors.grey[900],
            }}
          >
            <Typography variant="h6" gutterBottom>
              Monthly Revenue
            </Typography>
            <ResponsiveContainer width={"100%"} height={300}>
              <LineChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray={"3 3"} />
                <XAxis dataKey={"name"} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type={"monotone"} dataKey={"Revenue"} stroke={isDarkMode ? colors.greenAccent[500] : colors.greenAccent[300]} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Grid>
      <br />
      <Grid item sx={12}>
        <Card>
          <CardContent
            style={{
              backgroundColor: isDarkMode
                ? colors.primary[400]
                : colors.grey[900],
            }}
          >
            <Typography variant="h6" gutterBottom>
              All Transactions
            </Typography>
            <Grid container spacing={2}>
              {payments.map((payment) => (
                <Grid item xs={12} md={4} key={payment.id}>
                  <Card
                    variant="outlined"
                    style={{
                      backgroundColor: isDarkMode
                        ? colors.primary[500]
                        : colors.grey[800],
                    }}
                  >
                    <CardContent>
                      <Typography>
                        <strong>User: </strong>
                        {payment.user}
                      </Typography>
                      <Typography>
                        <strong>Amount: </strong>${payment.amount}
                      </Typography>
                      <Typography>
                        <strong>Date: </strong>
                        {new Date(payment.date).toLocaleString("en-US", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </Typography>
                      <Typography>
                        <strong>Method: </strong>
                        {payment.method}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Box>
  );
}
