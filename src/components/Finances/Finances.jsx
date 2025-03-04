import React, { useEffect, useState } from "react";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  TextField,
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

export default function Finances() {
  const [expenses, setExpenses] = useState([
    { id: 1, name: "Electrical Bill", amount: 120, date: "2024-07-01" },
    { id: 2, name: "Water Bill", amount: 50, date: "2024-07-05" },
    { id: 3, name: "Internet Bill", amount: 75, date: "2024-07-10" },
  ]);

  const [newExpense, setNewExpense] = useState({
    name: "",
    amount: "",
    date: "",
  });

  const [monthlyExpenses, setMonthlyExpenses] = useState([]);

  useEffect(() => {
    const calculateMonthlyExpenses = () => {
      const months = Array.from({ length: 12 }, (_, i) => ({
        name: new Date(0, i).toLocaleString("default", { month: "short" }),
        Expenses: 0,
      }));

      expenses.forEach((expense) => {
        const date = new Date(expense.date);
        const monthIndex = date.getMonth();
        months[monthIndex].Expenses += expense.amount;
      });

      const currentMonth = new Date().getMonth();
      setMonthlyExpenses(months.slice(0, currentMonth + 1));
    };

    calculateMonthlyExpenses();
  }, [expenses]);

  const addExpenseHandler = () => {
    if (!newExpense.name || !newExpense.amount || !newExpense.date) return;
    if (Number(newExpense.amount) <= 0) return;

    setExpenses((prev) => [
      ...prev,
      {
        ...newExpense,
        id: prev.length + 1,
        amount: Number(newExpense.amount),
      },
    ]);

    setNewExpense({ name: "", amount: "", date: "" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Box p={2}>
      <Header title="Finances" subtitle="Check your Bills" />

      <Card sx={{ mb: 2, backgroundColor: "#424242" }}>
        <CardContent>
          <Typography variant="h5">Monthly Summary</Typography>
          <Typography variant="body1">
            Total Expenses: $
            {expenses.reduce((acc, expense) => acc + expense.amount, 0)}
          </Typography>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2, backgroundColor: "#424242" }}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Expense Overview
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyExpenses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Expenses" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2, backgroundColor: "#424242" }}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Detailed Expenses
          </Typography>
          <Grid container spacing={2}>
            {expenses.map((expense) => (
              <Grid item xs={12} md={4} key={expense.id}>
                <Card sx={{ backgroundColor: "#616161" }}>
                  <CardContent>
                    <Typography variant="h6">{expense.name}</Typography>
                    <Typography variant="body2">
                      Amount: ${expense.amount}
                    </Typography>
                    <Typography variant="body2">
                      Date: {expense.date}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2, backgroundColor: "#424242" }}>
        <CardContent>
          <Typography variant="h5" mb={2}>
            Add New Expense
          </Typography>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              name="name"
              value={newExpense.name}
              onChange={handleInputChange}
              inputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Amount"
              variant="outlined"
              fullWidth
              type="number"
              name="amount"
              value={newExpense.amount}
              onChange={handleInputChange}
              inputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Date"
              variant="outlined"
              fullWidth
              type="date"
              name="date"
              value={newExpense.date}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              inputProps={{ style: { color: "white" } }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={addExpenseHandler}
            >
              Add Expense
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
