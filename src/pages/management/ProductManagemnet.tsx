import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



import {
  Box,
  Button,
  Container,
  Grid,
  Input,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const categories = ["Electronics", "Home Appliances", "Lego Robots", "Books", "Toys"];

const NewProduct = () => {
  const { id } = useParams();

  // State variables
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | string>("");
  const [category, setCategory] = useState<string>("");
  const [stock, setStock] = useState<number | string>("");
  const [brand, setBrand] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [ratings, setRatings] = useState<number | string>("");
  const [productSold, setProductSold] = useState<number | string>("");
  const [productWatched, setProductWatched] = useState<number | string>("");
  const [onSale, setOnSale] = useState<boolean>(false);
  const [detailsDescription, setDetailsDescription] = useState<string>("");
  const [features, setFeatures] = useState<string[]>([""]);
  const [submittedData, setSubmittedData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      const fetchProductDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/getProductById/${id}`);
          const product = response.data;

          setName(product.name || "");
          setDescription(product.description || "");
          setPrice(product.price || "");
          setCategory(product.category || "");
          setStock(product.stock || "");
          setBrand(product.brand || "");
          setRatings(product.ratings || "");
          setProductSold(product.productSold || "");
          setProductWatched(product.productWatched || "");
          setOnSale(product.onSale || false);
          setDetailsDescription(product.detailsDescription || "");
          setFeatures(product.features || []);
          setExistingImages(product.images || []);
          toast.success("Product details fetched successfully!");
        } catch (error) {
          console.error("Error fetching product details:", error);
          toast.error("Error fetching product details.");
        }
      };

      fetchProductDetails();
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImages([...images, ...fileArray]);

      const previews = fileArray.map((file) => URL.createObjectURL(file));
      setPreviewImages([...previewImages, ...previews]);
    }
  };

  const handleDeleteExistingImage = (index: number) => {
    const updatedImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedImages);
  };

  const handleDeleteNewImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setImages(updatedImages);
    setPreviewImages(updatedPreviews);
  };

  // Handle changes in feature input fields
  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  // Remove a feature field
  const removeFeatureField = (index: number) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    setFeatures(updatedFeatures);
  };

  // Add a new feature field
  const addFeatureField = () => {
    setFeatures([...features, ""]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price?.toString() || "");
    formData.append("category", category);
    formData.append("stock", stock?.toString() || "");
    formData.append("brand", brand);
    formData.append("ratings", ratings?.toString() || "");
    formData.append("productSold", productSold?.toString() || "");
    formData.append("productWatched", productWatched?.toString() || "");
    formData.append("onSale", JSON.stringify(onSale));
    formData.append("detailsDescription", detailsDescription);
    
    // Send features as a stringified array
    formData.append("features", JSON.stringify(features));
  
    // Send images
    images.forEach((image) => formData.append("images", image));
    formData.append("existingImages", JSON.stringify(existingImages));
  
    // Log FormData content
    console.log("FormData contents:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }
  
    try {
      const url = id ? `http://localhost:8080/updateProductById/${id}` : "http://localhost:8080/addProduct";
      const response = await axios({
        method: id ? "PUT" : "POST",
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setSubmittedData(response.data);
      toast.success(id ? "Product updated successfully!" : "Product created successfully!"); // Success toast

    } catch (error) {
      console.error("Error submitting data", error);
      toast.error("Error submitting product data."); // Error toast
    }
  };
  

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* <AdminSidebar /> */}
      <Typography variant="h4" sx={{ mb: 3 }}>
        {id ? "Edit Product" : "New Product"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Product Name */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </Grid>

          {/* Price */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
          </Grid>

          {/* Stock */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Brand */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Ratings"
              type="number"
              value={ratings}
              onChange={(e) => setRatings(Number(e.target.value))}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Product Sold"
              type="number"
              value={productSold}
              onChange={(e) => setProductSold(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Product Watched"
              type="number"
              value={productWatched}
              onChange={(e) => setProductWatched(Number(e.target.value))}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={onSale}
                  onChange={(e) => setOnSale(e.target.checked)}
                />
              }
              label="On Sale"
            />
          </Grid>


          {/* Details Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Details Description"
              multiline
              rows={4}
              value={detailsDescription}
              onChange={(e) => setDetailsDescription(e.target.value)}
              required
            />
          </Grid>

          {/* Features */}
          <Grid item xs={12}>
            <Typography variant="h6">Features</Typography>
            {features.map((feature, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <TextField
                  fullWidth
                  placeholder="Feature"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                />
                <IconButton onClick={() => removeFeatureField(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addFeatureField}
              sx={{ mt: 1 }}
            >
              Add Feature
            </Button>
          </Grid>

          {/* Images */}
          <Grid item xs={12}>
            <Typography variant="h6">Product Images</Typography>
            <Input type="file" inputProps={{ multiple: true }} onChange={handleImageChange} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
              {/* Existing Images */}
              {existingImages.map((src, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                  <img
                    src={`http://localhost:8080/${src}`}
                    alt={`Existing Preview ${`{index}`}`}
                    style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }}
                  />
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 0, right: 0, color: "red" }}
                    onClick={() => handleDeleteExistingImage(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}

              {/* New Images */}
              {previewImages.map((src, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                  <img
                    src={src}
                    alt={`New Preview ${index}`}
                    style={{ width: 100, height: 100, objectFit: "cover", borderRadius: 8 }}
                  />
                  <IconButton
                    size="small"
                    sx={{ position: "absolute", top: 0, right: 0, color: "red" }}
                    onClick={() => handleDeleteNewImage(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              {id ? "Update Product" : "Create Product"}
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </Container>
  );
};

export default NewProduct;
