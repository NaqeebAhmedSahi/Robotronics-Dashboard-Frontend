import { ChangeEvent, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";

const NewProduct = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>();
  const [category, setCategory] = useState<string>("");
  const [stock, setStock] = useState<number>();
  const [brand, setBrand] = useState<string>("");
  const [image, setImage] = useState<File | null>(null); // Add state for image
  const [preview, setPreview] = useState<string | null>(null);
  const [ratings, setRatings] = useState<number>();

  const [submittedData, setSubmittedData] = useState<any>(null);

  const categories = ["Educational Toy", "Curriculum Box", "Ardeno", "Lego Robot", "Others"];

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

    // Create JSON representation of form data
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

    // Display JSON in the console
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
        formData.append("image", image); // Append the file
      }

      const response = await axios.post("http://localhost:8080/addProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Handle the response from the backend
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
            <h2>New Product</h2>

            {/* Main Photo */}
            <div>
              <label>Product Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {preview && (
                <div>
                  <p>Image Preview:</p>
                  <img src={preview} alt="Product Preview" style={{ maxWidth: "200px", marginTop: "10px" }} />
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
                style={{
                  width: "100%",
                  height: "150px",
                  padding: "16px",
                }}
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
                style={{
                  width: "100%",
                  height: "49px",
                  padding: "16px",
                }}
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

            <button type="submit">Create Product</button>
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
