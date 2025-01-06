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
  monthlyPrice: number;
  annualPrice: number;
  category: string;
  whatYouLearn: string;
  targetAudience: string;
  image: string;
  video: string;
  features: string;
  rating: number;
  createdAt: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Image",
    accessor: "image",
    Cell: ({ value }) => (
      <img
        src={value}
        alt="RoboGenius"
        style={{ width: "50px", height: "50px", objectFit: "cover" }}
      />
    ),
  },
  {
    Header: "Video",
    accessor: "video",
    Cell: ({ value }) => (
      <video width="200px" controls>
        <source src={value} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    ),
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
    Header: "Monthly Price",
    accessor: "monthlyPrice",
  },
  {
    Header: "Annual Price",
    accessor: "annualPrice",
  },
  {
    Header: "Category",
    accessor: "category",
  },
  {
    Header: "What You Learn",
    accessor: "whatYouLearn",
  },
  {
    Header: "Target Audience",
    accessor: "targetAudience",
  },
  {
    Header: "Features",
    accessor: "features",
  },
  {
    Header: "Rating",
    accessor: "rating",
  },
  {
    Header: "Created At",
    accessor: "createdAt",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const RoboGenius = () => {
  const [data, setData] = useState<DataType[]>([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/getallRoboGenius");

      console.log("Fetched data:", response.data);

      const formattedData = response.data.data.map((item: any) => {
        const imageUrl = `http://localhost:8080${item.image?.url}`;
        const videoUrl = `http://localhost:8080${item.video?.url}`;
        const createdAt = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "N/A";

        return {
          title: item.title,
          description: item.description,
          monthlyPrice: item.monthlyPrice,
          annualPrice: item.annualPrice,
          category: item.category,
          whatYouLearn: `${item.whatYouLearn.description}, ${item.whatYouLearn.skills}`,
          targetAudience: item.targetAudience,
          features: item.features,
          rating: item.rating,
          image: imageUrl,
          video: videoUrl,
          createdAt: createdAt,
          action: (
            <div className="action-buttons">
              <button
                onClick={() =>
                  navigate(`/admin/robo_genius/edit/${item._id}`, {
                    state: { item },
                  })
                }
                className="update-button"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => handleDelete(item._id)}
                className="delete-button"
              >
                <FaTrashAlt />
              </button>
            </div>
          ),
        };
      });

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching RoboGenius data:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await axios.delete(`http://localhost:8080/deleteRoboGenius/${id}`);
      alert(response.data.message);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting RoboGenius:", error);
      alert("Failed to delete. Please try again.");
    }
  };

  const Table = useCallback(
    TableHOC<DataType>(columns, data, "dashboard-product-box", "RoboGenius", true),
    [data]
  );

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="products">{Table()}</main>
      <Link to="/admin/robo_genius/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default RoboGenius;
