/* eslint-disable react-hooks/exhaustive-deps */
import { ReactElement, useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Column } from "react-table";
import TableHOC from "../components/TableHOC";
import { FaTrash } from "react-icons/fa";

interface JobApplication {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  education: string;
  workExperience: string;
  skills: string;
  cvFile: string;
  coverLetter: string;
  createdAt: string;
}

interface DataType {
  name: string;
  email: string;
  phone: string;
  address: string;
  education: string;
  experience: string;
  skills: string;
  cvFile: ReactElement;
  coverLetter: string;
  createdAt: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  { Header: "Name", accessor: "name" },
  { Header: "Email", accessor: "email" },
  { Header: "Phone", accessor: "phone" },
  { Header: "Address", accessor: "address" },
  { Header: "Education", accessor: "education" },
  { Header: "Experience", accessor: "experience" },
  { Header: "Skills", accessor: "skills" },
  { Header: "CV File", accessor: "cvFile" },
  { Header: "Cover Letter", accessor: "coverLetter" },
  { Header: "Created At", accessor: "createdAt" },
  { Header: "Action", accessor: "action" },
];

const JobApplications = () => {
  const [data, setData] = useState<DataType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch("http://localhost:8080/cvForm/getAllApplication");
        if (!response.ok) {
          throw new Error("Failed to fetch job applications");
        }
        const result = await response.json();
        console.log(result.data);
        // Assuming the API response structure you shared earlier
        const applications: JobApplication[] = Array.isArray(result.data)
          ? result.data
          : [];

        const formattedData = applications.map((application) => ({
          name: `${application.firstName} ${application.lastName}`,
          email: application.email,
          phone: application.phone,
          address: `${application.streetAddress}, ${application.city}, ${application.state} ${application.postalCode}`,
          education: application.education,
          experience: application.workExperience,
          skills: application.skills,
          cvFile: (
            <a href={`http://localhost:8080/${application.cvFile}`} target="_blank" rel="noopener noreferrer">
              View CV
            </a>
          ),
          coverLetter: application.coverLetter,
          createdAt: new Date(application.createdAt).toLocaleString(),
          action: (
            <FaTrash
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDelete(application._id)}
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

    fetchApplications();
  }, []);

  const handleDelete = (id: string) => {
    console.log(`Delete application with ID: ${id}`);
    // Implement delete logic here
  };

  const TableComponent = TableHOC<DataType>(
    columns,
    data,
    "dashboard-product-box",
    "Job Applications",
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

export default JobApplications;
