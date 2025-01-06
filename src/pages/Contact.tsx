/* eslint-disable react-hooks/exhaustive-deps */
import { ReactElement, useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Column } from "react-table";
import TableHOC from "../components/TableHOC";
import { FaTrash } from "react-icons/fa";

interface Contact {
  _id: string;
  name: string;
  phone: string;
  email: string;
  schoolName?: string;
  address?: string;
  message: string;
  createdAt: string;
}

interface DataType {
  name: string;
  email: string;
  phone: string;
  schoolName: string;
  address: string;
  message: string;
  createdAt: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  { Header: "Name", accessor: "name" },
  { Header: "Email", accessor: "email" },
  { Header: "Phone", accessor: "phone" },
  { Header: "School Name", accessor: "schoolName" },
  { Header: "Address", accessor: "address" },
  { Header: "Message", accessor: "message" },
  { Header: "Created At", accessor: "createdAt" },
  { Header: "Action", accessor: "action" },
];

const ContactPage = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch("http://localhost:8080/contact/getAllContact");
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        const result = await response.json();
        console.log(result.data);
        
        // Assuming the API response structure
        const contacts: Contact[] = Array.isArray(result.data) ? result.data : [];

        const formattedData = contacts.map((contact) => ({
          name: contact.name,
          email: contact.email,
          phone: contact.phone,
          schoolName: contact.schoolName || "N/A",
          address: contact.address || "N/A",
          message: contact.message,
          createdAt: new Date(contact.createdAt).toLocaleString(),
          action: (
            <FaTrash
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDelete(contact._id)}
            />
          ),
        }));

        setData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleDelete = (id: string) => {
    console.log(`Delete contact with ID: ${id}`);
    // Implement delete logic here
  };

  const TableComponent = TableHOC<DataType>(
    columns,
    data,
    "dashboard-product-box",
    "Contact Information",
    true
  );

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

export default ContactPage;
