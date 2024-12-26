import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";

const NewProduct = () => {
  const { id } = useParams(); // Get the product ID from the URL

  // State variables
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | string>(""); // Allow empty value for initialization
  const [category, setCategory] = useState<string>("");
  const [stock, setStock] = useState<number | string>(""); // Allow empty value for initialization
  const [brand, setBrand] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [ratings, setRatings] = useState<number | string>(""); // Allow empty value for initialization

  const [submittedData, setSubmittedData] = useState<any>(null);

  const categories = ["Electronics", "Home Appliances", "Clothing", "Books", "Toys"];

  // Fetch product details when component mounts
  useEffect(() => {
    if (id) {
      const fetchProductDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/getProductById/${id}`);
          const product = response.data.product;
          console.log(product);

          // Populate state with product data
          setName(product.name || "");
          setDescription(product.description || "");
          setPrice(product.price || "");
          setCategory(product.category || "");
          setStock(product.stock || "");
          setBrand(product.brand || "");
          setRatings(product.averageRating || "");

          if (product.image.url) {
            setPreview(product.image.url);
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };

      fetchProductDetails();
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name,
      description,
      price,
      category,
      stock,
      brand,
      ratings,
      images: image ? image.name : null,
    };

    console.log("Form Data as JSON:", productData);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price?.toString() || "");
      formData.append("category", category);
      formData.append("stock", stock?.toString() || "");
      formData.append("brand", brand);
      formData.append("ratings", ratings?.toString() || "");

      if (image) {
        formData.append("image", image);
      }

     const response = await axios.put(`http://localhost:8080/updateProduct/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      console.log(response.data);
      setSubmittedData(response.data.product);
    } catch (error) {
      console.error("Error submitting data", error);
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={handleSubmit}>
            <h2>{id ? "Edit Product" : "New Product"}</h2>

            {/* Main Photo */}
            <div>
              <label>Product Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {preview && (
                <div>
                  {/* <p>Image Preview:</p> */}
                  <img className="mt-6" src={preview} alt="Product Preview" style={{ maxWidth: "200px", marginTop: "10px" }} />
                </div>
              )}
            </div>

            {/* Product Name */}
            <div>
              <label>Name</label>
              <input
                required
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label>Description</label>
              <textarea
                required
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ width: "100%", height: "150px", padding: "16px" }}
              />
            </div>

            {/* Price */}
            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>

            {/* Category */}
            <div>
              <label>Category</label>
              <select
                className="dropdown"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", height: "49px", padding: "16px" }}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label>Brand</label>
              <input
                required
                type="text"
                placeholder="Brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>

            {/* Stock */}
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            {/* Ratings */}
            <div>
              <label>Ratings (1-5)</label>
              <input
                type="number"
                placeholder="Ratings"
                value={ratings}
                onChange={(e) => setRatings(Number(e.target.value))}
                min={1}
                max={5}
              />
            </div>

            <button type="submit">{id ? "Update Product" : "Create Product"}</button>
          </form>

          {/* Display submitted data */}
          {submittedData && (
            <div>
              <h3>Product Submitted:</h3>
              <pre>{JSON.stringify(submittedData, null, 2)}</pre>
            </div>
          )}
        </article>
      </main>
    </div>
  );
};

export default NewProduct;
