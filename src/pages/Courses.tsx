import { ReactElement, useCallback, useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TableHOC from "../components/TableHOC";
import { Column } from "react-table";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface DataType {
  title: string;
  description: string;
  instructor: string;
  duration: number;
  price: number;
  category: "course" | "product";
  level: "Beginner" | "Intermediate" | "Advanced";
  image: string; // Added image field
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Image",
    accessor: "image",
    Cell: ({ value }) => (
      <img
        src={value}
        alt="Course"
        style={{ width: "50px", height: "50px", objectFit: "cover" }}
      />
    ), // Displaying the image
  },
  {
    Header: "Title",
    accessor: "title",
  },
  {
    Header: "Description",
    accessor: "description",
  },
  {
    Header: "Instructor",
    accessor: "instructor",
  },
  {
    Header: "Duration (hrs)",
    accessor: "duration",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Category",
    accessor: "category",
  },
  {
    Header: "Level",
    accessor: "level",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Courses = () => {
  const [data, setData] = useState<DataType[]>([]);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:8080/all/courses");
  
      // Log the fetched data
      console.log("Fetched courses data:", response.data);
  
      const fetchedCourses = response.data.map((course: any) => {
        // Handle cases where image is null or has the object format
        const imageUrl = course.image?.url || "http://localhost:8080/default-image.jpg";
  
        // Log each processed image URL
        console.log("Processed Course Image URL:", imageUrl);
  
        return {
          title: course.title,
          description: course.description,
          instructor: course.instructor,
          duration: course.duration,
          price: course.price,
          category: course.category,
          level: course.level,
          image: imageUrl, // Ensure a valid image URL
          action: (
            <div className="action-buttons">
              <button
                onClick={() =>
                  navigate(`/admin/course/${course._id}`, {
                    state: { course: course },
                  })
                }
                className="update-button"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(course._id)}
                className="delete-button"
              >
                <FaTrashAlt />
              </button>
            </div>
          ),
        };
      });
  
      setData(fetchedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };
  
  

  useEffect(() => {
    fetchCourses();
  }, [navigate]);

  const handleDelete = async (courseId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/coursesById/${courseId}`
      );
      alert(response.data.message);
      fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course. Please try again.");
    }
  };

  const Table = useCallback(TableHOC<DataType>(columns, data, "dashboard-product-box", "Courses", true), [data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="products">{Table()}</main>
      <Link to="/admin/course/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Courses;
