import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import { BsSearch } from "react-icons/bs";
import { BiMaleFemale } from "react-icons/bi";
import { FaRegBell } from "react-icons/fa";
import { HiTrendingUp, HiTrendingDown } from "react-icons/hi";
import userImg from "../assets/userImage.png"; // Placeholder image
import data from "../assets/data.json";
import { BarChart, DougnutChart } from "../components/Charts";
import DashBoardTable from "../components/DashBoardTable";
import { Avatar, Box, Typography } from "@mui/material";

const Dashboard = () => {
  const [courseCount, setCourseCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [adminName, setAdminName] = useState("Admin Name");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Replace these URLs with your actual API endpoints
        const [coursesRes, productsRes] = await Promise.all([
          axios.get("http://localhost:8080/all/courses"),
          axios.get("http://localhost:8080/getProducts"),
        ]);

        setCourseCount(coursesRes.data.length || 0);
        setProductCount(productsRes.data.length || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="dashboard">
        <div className="bar">
          <BsSearch />
          <input type="text" placeholder="Search for data, users, docs" />
          <FaRegBell />
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, padding: "8px 16px" }}>
            <Avatar sx={{ bgcolor: "#3f51b5" }}>A</Avatar>
            <Typography variant="body1" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              {adminName}
            </Typography>
          </Box>
        </div>
        <section className="widget-container">
          {isLoading ? (
            <p>Loading data...</p>
          ) : (
            <>
              <WidgetItem percent={40} value={340000} heading="Revenue" color="rgba(0,115,255)" />
              <WidgetItem percent={-14} value={400} heading="Users" color="rgba(0,198,202)" />
              <WidgetItem percent={80} value={courseCount} heading="Courses" color="rgba(0,115,255)" />
              <WidgetItem percent={30} value={productCount} heading="Products" color="rgba(276, 20, 255)" />
            </>
          )}
        </section>
        <section className="graph-container">
          <div className="revenue-chart">
            <h2>Revenue & Transaction</h2>
            <BarChart
              data_1={[300, 144, 433, 655, 237, 755, 190]}
              data_2={[200, 444, 343, 556, 778, 455, 990]}
              title_1="Revenue"
              title_2="Transaction"
              bgColor_1="rgb(0,115,255"
              bgColor_2="rgba(53,162,235,0.8)"
            />
          </div>
          <div className="dashboard-categories">
            <h2>Inventory</h2>
            <div>
              {data.categories.map((category, index) => (
                <CategoryItem
                  key={index}
                  heading={category.heading}
                  value={category.value}
                  color={`hsl(${category.value * 4},${category.value}%,50%)`}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="transaction-container">
          <div className="gender-chart">
            <h2>Gender Ratio</h2>
            <DougnutChart
              labels={["Female", "Male"]}
              data={[12, 19]}
              backgroundColor={["hsl(340,82%,56%", "rgba(53,162,235,0.8)"]}
            />
            <p>
              <BiMaleFemale />
            </p>
          </div>
          <DashBoardTable data={data.transaction} />
        </section>
      </main>
    </div>
  );
};

interface WidgetItemProps {
  heading: string;
  value: number;
  percent: number;
  color: string;
  amount?: boolean;
}

const WidgetItem = ({ heading, value, percent, color, amount }: WidgetItemProps) => (
  <article className="widget">
    <div className="widget-info">
      <p>{heading}</p>
      <h4>{amount ? `$${value}` : value}</h4>
      {percent > 0 ? (
        <span className="green">
          <HiTrendingUp /> + {percent}%
        </span>
      ) : (
        <span className="red">
          <HiTrendingDown /> {percent}%
        </span>
      )}
    </div>
    <div
      className="widget-circle"
      style={{
        background: `conic-gradient(${color} ${Math.abs((percent / 100) * 360)}deg,rgb(255,255,255) 0)`,
      }}
    >
      <span style={{ color: `${color}` }}>{percent}%</span>
    </div>
  </article>
);

interface CategoryItemProps {
  color: string;
  value: number;
  heading: string;
}

const CategoryItem = ({ color, value, heading }: CategoryItemProps) => (
  <div className="category-item">
    <h5>{heading}</h5>
    <div>
      <div
        style={{
          backgroundColor: color,
          width: `${value}%`,
        }}
      ></div>
    </div>
    <span>{value}%</span>
  </div>
);

export default Dashboard;
