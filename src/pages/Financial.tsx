import React from "react";
import {
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  IconButton,
  Box,
} from "@mui/material";
import { FaMoneyBillWave, FaChartLine, FaChartPie, FaUsers } from "react-icons/fa";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
} from "recharts";
import AdminSidebar from "../components/AdminSidebar";

const FinancialPage: React.FC = () => {
  // Sample data
  const lineChartData = [
    { month: "Jan", revenue: 4000 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 5000 },
    { month: "Apr", revenue: 7000 },
    { month: "May", revenue: 6000 },
    { month: "Jun", revenue: 8000 },
  ];

  const pieChartData = [
    { name: "Marketing", value: 3000 },
    { name: "Development", value: 6000 },
    { name: "Operations", value: 2000 },
    { name: "Sales", value: 4000 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const barChartData = [
    { category: "Q1", profit: 2400, loss: 1400 },
    { category: "Q2", profit: 3200, loss: 800 },
    { category: "Q3", profit: 2900, loss: 1200 },
    { category: "Q4", profit: 4000, loss: 900 },
  ];

  const areaChartData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 7000 },
    { name: "May", value: 6000 },
    { name: "Jun", value: 8000 },
  ];

  const scatterChartData = [
    { x: 1, y: 4000 },
    { x: 2, y: 3000 },
    { x: 3, y: 5000 },
    { x: 4, y: 7000 },
    { x: 5, y: 6000 },
    { x: 6, y: 8000 },
  ];

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", background: "#f5f5f5" }}>
        {/* Header */}
        <Typography variant="h4" align="center" gutterBottom>
          Financial Dashboard
        </Typography>

        {/* Summary Cards */}
        <Grid container spacing={3} style={{ marginBottom: "20px" }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card style={{ background: "#1976d2", color: "#fff" }}>
              <CardContent>
                <Typography variant="h6">Total Revenue</Typography>
                <Typography variant="h4">$50,000</Typography>
                <IconButton style={{ color: "#fff" }}>
                  <FaMoneyBillWave />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card style={{ background: "#00C49F", color: "#fff" }}>
              <CardContent>
                <Typography variant="h6">Expenses</Typography>
                <Typography variant="h4">$20,000</Typography>
                <IconButton style={{ color: "#fff" }}>
                  <FaChartLine />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card style={{ background: "#FFBB28", color: "#fff" }}>
              <CardContent>
                <Typography variant="h6">Net Profit</Typography>
                <Typography variant="h4">$30,000</Typography>
                <IconButton style={{ color: "#fff" }}>
                  <FaChartPie />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card style={{ background: "#FF8042", color: "#fff" }}>
              <CardContent>
                <Typography variant="h6">Customers</Typography>
                <Typography variant="h4">1,200</Typography>
                <IconButton style={{ color: "#fff" }}>
                  <FaUsers />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Graphs Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Revenue Over Time
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="#1976d2" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Expense Breakdown
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Quarterly Profit & Loss
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="profit" fill="#00C49F" />
                  <Bar dataKey="loss" fill="#FF8042" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Area Chart of Revenue
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={areaChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="value" stroke="#1976d2" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper style={{ padding: "20px" }}>
              <Typography variant="h6" gutterBottom>
                Scatter Plot of Revenue vs. Month
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" dataKey="x" name="Month" />
                  <YAxis type="number" dataKey="y" name="Revenue" />
                  <Tooltip />
                  <Scatter data={scatterChartData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default FinancialPage;
