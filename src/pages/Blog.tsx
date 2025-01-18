/* eslint-disable react-hooks/exhaustive-deps */
import { ReactElement, useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Column } from "react-table";
import TableHOC from "../components/TableHOC";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";


interface Author {
  name: string;
  avatar: string;
}

interface Blog {
  _id: string;
  image: string;
  tags: string[];
  title: string;
  description: string;
  author: Author;
  date: string;
  shares: string;
}

interface DataType {
  image: ReactElement;
  tags: string;
  title: string;
  description: string;
  author: ReactElement;
  date: string;
  shares: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  { Header: "Image", accessor: "image" },
  { Header: "Tags", accessor: "tags" },
  { Header: "Title", accessor: "title" },
  { Header: "Description", accessor: "description" },
  { Header: "Author", accessor: "author" },
  { Header: "Date", accessor: "date" },
  { Header: "Shares", accessor: "shares" },
  { Header: "Action", accessor: "action" },
];

const BlogPage = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:8080/blog/getAllBlogs");
        if (!response.ok) {
          throw new Error("Failed to fetch blog posts");
        }
        const result = await response.json();
        console.log(result.data);

        // Assuming the API response structure
        const blogs: Blog[] = Array.isArray(result.data) ? result.data : [];

        const formattedData = blogs.map((blog) => ({
          image: (
            <img
              src={blog.image}
              alt={blog.title}
              style={{ width: "50px", height: "50px", objectFit: "cover" }}
            />
          ),
          tags: blog.tags.join(", "),
          title: blog.title,
          description: blog.description,
          author: (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img
                src={blog.author.avatar}
                alt={blog.author.name}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  marginRight: "10px",
                }}
              />
              {blog.author.name}
            </div>
          ),
          date: new Date(blog.date).toLocaleDateString(),
          shares: blog.shares,
          action: (
            <FaTrash
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDelete(blog._id)}
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

    fetchBlogs();
  }, []);

  const handleDelete = (id: string) => {
    console.log(`Delete blog post with ID: ${id}`);
    // Implement delete logic here
  };

  const TableComponent = TableHOC<DataType>(
    columns,
    data,
    "dashboard-blog-box",
    "Blog Posts",
    true
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-container">
      <AdminSidebar />
      <TableComponent />
      <Link to="/admin/NewBlog/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default BlogPage;
