/* eslint-disable react-hooks/exhaustive-deps */
import { ReactElement, useEffect, useState , useCallback } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Column } from "react-table";
import TableHOC from "../components/TableHOC";
import { FaTrash } from "react-icons/fa";

interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  isAdmin: boolean;
  gender: string;
  phone: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DataType {
  avatar: ReactElement;
  name: string;
  email: string;
  gender: string;
  phone: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Avatar",
    accessor: "avatar",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Phone",
    accessor: "phone",
  },
  {
    Header: "Role",
    accessor: "role",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Created At",
    accessor: "createdAt",
  },
  {
    Header: "Updated At",
    accessor: "updatedAt",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const defaultAvatar = "https://i.pinimg.com/736x/f4/a3/4e/f4a34ef7fd2f8d3a347a8c0dfb73eece.jpg";

const Users = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const response = await fetch("http://localhost:8080/getAll");
            if (!response.ok) {
                throw new Error("Failed to fetch users");
            }
            const result = await response.json();

            // Adjust this based on the structure of the API response
            const users: User[] = Array.isArray(result) ? result : result.data || result.users || [];

            const formattedData = users.map((user) => ({
                avatar: (
                    <img
                        src={defaultAvatar}
                        style={{ borderRadius: "50%", width: 40, height: 40 }}
                        alt="profile"
                    />
                ),
                name: user.username,
                email: user.email,
                gender: user.gender,
                phone: user.phone,
                role: user.isAdmin ? "Admin" : "User",
                status: user.active ? "Active" : "Inactive",
                createdAt: new Date(user.createdAt).toLocaleString(),
                updatedAt: new Date(user.updatedAt).toLocaleString(),
                action: <FaTrash style={{ cursor: "pointer" }} onClick={() => handleDelete(user._id)} />,
            }));

            setData(formattedData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
}, []);


  const handleDelete = (id: string) => {
    // Implement delete logic here
    console.log(`Delete user with ID: ${id}`);
  };

  const TableComponent = TableHOC<DataType>(columns, data, "dashboard-product-box", "Users", true);



  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
	  <TableComponent />
    </div>
  );
};

export default Users;
