import { ReactElement, useCallback, useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import TableHOC from "../components/TableHOC";
import { Column } from "react-table";
import { FaPlus, FaTrashAlt, FaEdit } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

interface DataType {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  brand: string;
  ratings: number;
  productSold: number;
  productWatched: number;
  onSale: boolean;
  detailsDescription: string;
  features: string[];
  images: string[];
  createdAt: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "Image",
    accessor: "images",
    Cell: ({ value }) => (
      <div style={{ display: "flex", gap: "5px" }}>
        {value.slice(0, 10).map((img: string, index: number) => (
          <img
            key={index}
            src={`http://localhost:8080/${img}`}
            alt="Product"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ))}
      </div>
    ), // Displaying multiple images
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Description",
    accessor: "description",
    Cell: ({ value }) => (
      <div title={value} style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "150px" }}>
        {value}
      </div>
    ),
  },
  {
    Header: "Stock",
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
    Header: "Brand",
    accessor: "brand",
  },
  {
    Header: "Ratings",
    accessor: "ratings",
  },
  {
    Header: "Product Sold",
    accessor: "productSold",
  },
  {
    Header: "Product Watched",
    accessor: "productWatched",
  },
  {
    Header: "On Sale",
    accessor: "onSale",
    Cell: ({ value }) => (value ? "Yes" : "No"),
  },
  {
    Header: "Details Description",
    accessor: "detailsDescription",
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
    Header: "Created At",
    accessor: "createdAt",
    Cell: ({ value }) => new Date(value).toLocaleString(),
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Products = () => {
  const [data, setData] = useState<DataType[]>([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/getProducts");
      const products = response.data.products;

      const formattedProducts = products.map((product: any) => ({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        stock: product.stock,
        brand: product.brand,
        ratings: product.ratings,
        productSold: product.productSold,
        productWatched: product.productWatched,
        onSale: product.onSale,
        detailsDescription: product.detailsDescription,
        features: product.features,
        images: product.images,
        createdAt: product.createdAt,
        action: (
          <div className="action-buttons">
            <button
              onClick={() =>
                navigate(`/admin/product/${product._id}`, {
                  state: { product },
                })
              }
              className="update-button"
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}

            >
              <EditIcon
                style={{
                  color: "blue",
                  transition: "transform 0.3s ease",
                }}
                className="hover-grow"
              />
            </button>
            <button
              onClick={() => handleDelete(product._id)}
              className="delete-button"
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <DeleteIcon
                style={{
                  color: "red",
                  transition: "transform 0.3s ease",
                  
                }}
                className="hover-grow"
              />
            </button>
          </div>
        ),
      }));

      setData(formattedProducts);
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

  const Table = useCallback(
    TableHOC<DataType>(columns, data, "dashboard-product-box", "Products", true),
    [data]
  );

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
