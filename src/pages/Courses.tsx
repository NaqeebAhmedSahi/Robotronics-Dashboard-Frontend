import React, { ReactElement, useCallback, useEffect, useState } from "react";
import { toast, ToastContainer  } from "react-toastify";
import { useLocation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import AdminSidebar from "../components/AdminSidebar";
import TableHOC from "../components/TableHOC";
import { Column } from "react-table";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface Content {
  id: string;
  type: string;
  name: string;
  file: string;
}

interface Module {
  id: string;
  name: string;
  contents: Content[];
}

interface Section {
  id: string;
  name: string;
  modules: Module[];
}

interface DataType {
  title: string;
  description: string;
  category: string;
  reviews: number;
  date: string;
  studentsDownloaded: number;
  freeTrial: boolean;
  features: string[];
  whatYouLearn: string[];
  options: string[];
  thumbnail: string;
  banner: string;
  video: string;
  sections: Section[];
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Title",
    accessor: "title",
    Cell: ({ value }) => <strong>{value}</strong>,
  },
  {
    Header: "Category",
    accessor: "category",
  },
  {
    Header: "Reviews",
    accessor: "reviews",
  },
  {
    Header: "Students",
    accessor: "studentsDownloaded",
  },
  {
    Header: "Free Trial",
    accessor: "freeTrial",
    Cell: ({ value }) => (value ? "Yes" : "No"),
  },
  {
    Header: "Features",
    accessor: "features",
    Cell: ({ value }) => (
      <ul>
        {value.map((feature: string, index: number) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
    ),
  },
  {
    Header: "Thumbnail",
    accessor: "thumbnail",
    Cell: ({ value }) => (
      <img
        src={`http://localhost:8080/${value}`}
        alt="Thumbnail"
        style={{
          maxWidth: "100px",
          maxHeight: "100px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "5px",
        }}
      />
    ),
  },
  {
    Header: "Banner",
    accessor: "banner",
    Cell: ({ value }) => (
      <img
        src={`http://localhost:8080/${value}`}
        alt="Banner"
        style={{
          maxWidth: "150px",
          maxHeight: "100px",
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "5px",
        }}
      />
    ),
  },
  {
    Header: "Video",
    accessor: "video",
    Cell: ({ value }) => (
      <video
        controls
        style={{
          maxWidth: "150px",
          border: "1px solid #ddd",
          borderRadius: "4px",
        }}
      >
        <source src={`http://localhost:8080/${value}`} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ),
  },
  {
    Header: "Sections",
    accessor: "sections",
    Cell: ({ value }) => (
      <div style={{ maxHeight: "200px", overflowY: "auto" }}>
        {value.map((section: Section) => (
          <div key={section.id} style={{ marginBottom: "10px" }}>
            <strong>{section.name}</strong>
            <ul style={{ marginLeft: "20px", listStyleType: "circle" }}>
              {section.modules.map((module) => (
                <li key={module.id}>
                  <strong>{module.name}</strong>
                  <ul style={{ marginLeft: "20px", listStyleType: "disc" }}>
                    {module.contents.map((content) => (
                      <li key={content.id}>
                        {content.name} - {content.type} -{" "}
                        <a
                          href={
                            content.file.startsWith("http")
                              ? content.file
                              : `http://localhost:8080${content.file}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: "#007bff",
                            textDecoration: "underline",
                          }}
                        >
                          View File
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ),
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Courses = () => {
  const [data, setData] = useState<DataType[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if a message is available in the location state
    if (location.state?.message) {
      toast.success(location.state.message);
    }
  }, [location.state]);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:8080/get-courses");
      console.log("Fetched courses data:", response.data);

      const courses = Array.isArray(response.data)
        ? response.data
        : response.data?.courses || [];

      const formattedCourses = courses.map((course: any) => ({
        title: course.title,
        description: course.description,
        category: course.category,
        reviews: course.reviews,
        date: course.date || "",
        studentsDownloaded: course.studentsDownloaded,
        freeTrial: course.freeTrial,
        features: course.features || [],
        whatYouLearn: course.whatYouLearn || [],
        options: course.options || [],
        sections: course.sections || [],
        thumbnail: course.thumbnail || "",
        banner: course.banner || "",
        video: course.video || "",
        action: (
          <div className="action-buttons">
            <button
              onClick={() =>
                navigate(`/admin/course/${course._id}`, {
                  state: { course },
                })
              }
              className="update-button"
              style={{
                backgroundColor: "#ffc107",
                border: "none",
                color: "#fff",
                padding: "5px 10px",
                marginRight: "5px",
                borderRadius: "4px",
              }}
            >
              <FaEdit />
            </button>
            <button
              onClick={() => handleDelete(course._id)}
              className="delete-button"
              style={{
                backgroundColor: "#dc3545",
                border: "none",
                color: "#fff",
                padding: "5px 10px",
                borderRadius: "4px",
              }}
            >
              <FaTrashAlt />
            </button>
          </div>
        ),
      }));

      setData(formattedCourses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

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

  const Table = useCallback(
    TableHOC<DataType>(columns, data, "dashboard-product-box", "Courses", true),
    [data]
  );

  return (

    <div className="admin-container">
      
      <AdminSidebar />
      <main className="products">
        <h1 style={{ textAlign: "center", margin: "20px 0" }}>Courses</h1>
        {Table()}
      </main>
      <Link to="/admin/course/new" className="create-product-btn">
        <FaPlus />
      </Link>
      <ToastContainer/>
    </div>
     
  );
};

export default Courses;
