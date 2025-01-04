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
  Grid,
  Modal,
} from "@mui/material";
import AdminSidebar from "../components/AdminSidebar";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

interface Blog {
  id: number;
  title: string;
  content: string;
}

const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [newBlog, setNewBlog] = useState({ title: "", content: "" });
  const [editBlog, setEditBlog] = useState<Blog | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    if (editBlog) {
      setEditBlog({ ...editBlog, [field]: value });
    } else {
      setNewBlog({ ...newBlog, [field]: value });
    }
  };

  const handleAddBlog = () => {
    if (newBlog.title && newBlog.content) {
      setBlogs([
        ...blogs,
        { id: Date.now(), title: newBlog.title, content: newBlog.content },
      ]);
      setNewBlog({ title: "", content: "" });
    } else {
      alert("Please fill in all fields");
    }
  };

  const handleDeleteBlog = (id: number) => {
    const updatedBlogs = blogs.filter((blog) => blog.id !== id);
    setBlogs(updatedBlogs);
  };

  const handleUpdateBlog = (blog: Blog) => {
    setEditBlog(blog);
    setModalOpen(true);
  };

  const handleModalSave = () => {
    if (editBlog) {
      const updatedBlogs = blogs.map((blog) =>
        blog.id === editBlog.id ? editBlog : blog
      );
      setBlogs(updatedBlogs);
      setModalOpen(false);
      setEditBlog(null);
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
          Manage Blogs
        </Typography>

        {/* Add Blog Form */}
        <Grid container spacing={3} style={{ marginBottom: "20px" }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Blog Title"
              variant="outlined"
              fullWidth
              value={newBlog.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Blog Content"
              variant="outlined"
              fullWidth
              multiline
              rows={6} // Adjusted rows for a larger text area
              style={{
                background: "#fff",
                borderRadius: "8px",
              }}
              value={newBlog.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddBlog}
              style={{
                width: "100%",
                padding: "10px 0",
                background: "#1976d2",
                fontSize: "16px",
              }}
            >
              Add Blog
            </Button>
          </Grid>
        </Grid>

        {/* Blogs Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow style={{ background: "#1976d2" }}>
                <TableCell align="center" style={{ color: "#fff" }}>
                  Title
                </TableCell>
                <TableCell align="center" style={{ color: "#fff" }}>
                  Content
                </TableCell>
                <TableCell align="center" style={{ color: "#fff" }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {blogs.map((blog) => (
                <TableRow key={blog.id}>
                  <TableCell align="center">{blog.title}</TableCell>
                  <TableCell align="center">{blog.content}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleUpdateBlog(blog)}
                    >
                      <FaEdit />
                    </IconButton>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteBlog(blog.id)}
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

      {/* Edit Blog Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="edit-blog-modal"
        aria-describedby="edit-blog-form"
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
            id="edit-blog-modal"
            variant="h6"
            align="center"
            style={{ marginBottom: "20px", color: "#333" }}
          >
            Edit Blog
          </Typography>
          <TextField
            label="Blog Title"
            variant="outlined"
            fullWidth
            style={{ marginBottom: "20px" }}
            value={editBlog?.title || ""}
            onChange={(e) => handleInputChange("title", e.target.value)}
          />
          <TextField
            label="Blog Content"
            variant="outlined"
            fullWidth
            multiline
            rows={8} // Larger text area for content in the modal
            style={{
              background: "#f9f9f9",
              borderRadius: "8px",
              marginBottom: "20px",
            }}
            value={editBlog?.content || ""}
            onChange={(e) => handleInputChange("content", e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleModalSave}
            style={{
              padding: "10px 0",
              background: "#1976d2",
              fontSize: "16px",
            }}
          >
            Save Changes
          </Button>
        </Paper>
      </Modal>
    </div>
  );
};

export default BlogPage;
