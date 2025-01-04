import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
} from "@mui/material";
import AdminSidebar from "../components/AdminSidebar";
import { FaTrashAlt, FaReply } from "react-icons/fa";

interface Customer {
  id: number;
  name: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: "John Doe", email: "john@example.com", message: "Need help with my order." },
    { id: 2, name: "Jane Smith", email: "jane@example.com", message: "Inquiry about a product." },
  ]);

  const [responseMessage, setResponseMessage] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDeleteCustomer = (id: number) => {
    const updatedCustomers = customers.filter((customer) => customer.id !== id);
    setCustomers(updatedCustomers);
  };

  const handleRespondCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  const handleSendResponse = () => {
    if (selectedCustomer) {
      console.log(`Response to ${selectedCustomer.email}: ${responseMessage}`);
      // Here you can add logic to send the response message, such as making an API call.
      setModalOpen(false);
      setResponseMessage("");
    }
  };

  return (
    <div className="admin-container" >
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", background: "#f5f5f5" }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ marginBottom: "20px", color: "#333" }}
        >
          Customer Contacts
        </Typography>

        {/* Customers Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{ background: "#1976d2" }}>
                <TableCell align="center" style={{ color: "#fff" }}>
                  Name
                </TableCell>
                <TableCell align="center" style={{ color: "#fff" }}>
                  Email
                </TableCell>
                <TableCell align="center" style={{ color: "#fff" }}>
                  Message
                </TableCell>
                <TableCell align="center" style={{ color: "#fff" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell align="center">{customer.name}</TableCell>
                  <TableCell align="center">{customer.email}</TableCell>
                  <TableCell align="center">{customer.message}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleRespondCustomer(customer)}
                    >
                      <FaReply />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteCustomer(customer.id)}
                    >
                      <FaTrashAlt />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Respond Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="respond-modal"
        aria-describedby="respond-message-form"
      >
        <Paper
          style={{
            width: "500px",
            margin: "100px auto",
            padding: "20px",
            position: "relative",
            borderRadius: "10px",
          }}
        >
          <Typography
            id="respond-modal"
            variant="h6"
            align="center"
            style={{ marginBottom: "20px", color: "#333" }}
          >
            Respond to {selectedCustomer?.name}
          </Typography>
          <TextField
            label="Response Message"
            variant="outlined"
            fullWidth
            multiline
            rows={6}
            style={{
              background: "#f9f9f9",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSendResponse}
            style={{
              padding: "10px 0",
              background: "#1976d2",
              fontSize: "16px",
            }}
          >
            Send Response
          </Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default ContactPage;
