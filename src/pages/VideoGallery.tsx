import { ReactElement, useCallback, useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TableHOC from "../components/TableHOC";
import { Column } from "react-table";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface VideoDataType {
  thumbnail: string; // Workshop thumbnail image
  workshopName: string; // Workshop name
  description: string; // Description of the workshop
  timeFrom: string; // Start time
  timeTo: string; // End time
  action: ReactElement;
}

const columns: Column<VideoDataType>[] = [
  {
    Header: "Thumbnail",
    accessor: "thumbnail",
    Cell: ({ value }) => (
      <img
        src={value}
        alt="Workshop Thumbnail"
        style={{ width: "50px", height: "50px", objectFit: "cover" }}
      />
    ),
  },
  {
    Header: "Workshop Name",
    accessor: "workshopName",
  },
  {
    Header: "Description",
    accessor: "description",
  },
  {
    Header: "Time From",
    accessor: "timeFrom",
  },
  {
    Header: "Time To",
    accessor: "timeTo",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {
  const [data, setData] = useState<VideoDataType[]>([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/allVideoGallery");
  
      // Log the fetched response data
      console.log("Fetched data:", response.data);
  
      // Check if 'data' exists and is an array
      if (Array.isArray(response.data.data)) {
        const fetchProducts = response.data.data.map((products: any) => {
          const imageUrl = `http://localhost:8080/${products.thumbnail}` || "http://localhost:8080/default-image.jpg";
  
          // Print the image URL
          console.log("Thumbnail URL:", imageUrl);
  
          return {
            thumbnail: imageUrl,
            workshopName: products.workshopName,
            description: products.description,
            timeFrom: products.time.from,
            timeTo: products.time.to,
            action: (
              <div className="action-buttons">
                <button
                  onClick={() =>
                    navigate(`/admin/product/${products._id}`, {
                      state: { products: products },
                    })
                  }
                  className="update-button"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(products._id)}
                  className="delete-button"
                >
                  <FaTrashAlt />
                </button>
              </div>
            ),
          };
        });
  
        setData(fetchProducts);
      } else {
        console.error("Error: Response data.data is not an array", response.data);
        alert("Data format error: Expected an array of video galleries.");
      }
    } catch (error) {
      console.error("Error fetching Products:", error);
      alert("Failed to fetch products. Please try again.");
    }
  };
  
  

  useEffect(() => {
    fetchProducts();
  }, [navigate]);

  const handleDelete = async (productId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/deleteGallery/${productId}`
      );
      alert(response.data.message);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const Table = useCallback(
    TableHOC<VideoDataType>(columns, data, "dashboard-product-box", "Video Gallery", true),
    [data]
  );

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="products">{Table()}</main>
      <Link to="/admin/NewVideoGallery/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
