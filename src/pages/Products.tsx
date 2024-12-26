import { ReactElement, useCallback, useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TableHOC from "../components/TableHOC";
import { Column } from "react-table";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

interface DataType {
  name: string;
  description: string;
  stock: number;
  price: number;
  category: "course" | "product";
  brand: string;
  image: string; // Added image field
  averageRating: number;
  numOfReviews: number;
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
        alt="Course"
        style={{ width: "50px", height: "50px", objectFit: "cover" }}
      />
    ), // Displaying the image
  },
  {
    Header: "name",
    accessor: "name",
  },
  {
    Header: "Description",
    accessor: "description",
  },
  {
    Header: "stock",
    accessor: "stock",
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
    Header: "brand",
    accessor: "brand",
  },
  {
    Header: "averageRating",
    accessor: "averageRating",
  },
  {
    Header: "createdAt",
    accessor: "createdAt",
  },
  {
    Header: "Action",
    accessor: "action",
  }
];

const Products = () => {
  const [data, setData] = useState<DataType[]>([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/getProducts");
  
      // Log the fetched data
      console.log("Fetched courses data:", response.data);
  
      const fetchProducts = response.data.map((products: any) => {
        // Handle cases where image is null or has the object format
        const imageUrl = products.image?.url || "http://localhost:8080/default-image.jpg";
  
        // Log each processed image URL
        console.log("Processed Course Image URL:", imageUrl);
  
        return {
          name: products.name,
          description: products.description,
          stock: products.stock,
          price: products.price,
          category: products.category,
          brand: products.brand,
          image: imageUrl,
          averageRating: products.averageRating,
          // numOfReviews: products.numOfReviews,
          createdAt: products.createdAt,
         // Ensure a valid image URL
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
    } catch (error) {
      console.error("Error fetching Products:", error);
    }
  };
  
  

  useEffect(() => {
    fetchProducts();
  }, [navigate]);

  const handleDelete = async (productId: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:8080/deleteProduct/${productId}`
      );
      alert(response.data.message);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  const Table = useCallback(TableHOC<DataType>(columns, data, "dashboard-product-box", "Products", true), [data]);

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="products">{Table()}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;
