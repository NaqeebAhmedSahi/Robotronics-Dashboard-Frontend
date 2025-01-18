import { useState } from "react";
import {
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Box,
  Typography,
  Grid,
  InputAdornment,
  Paper,
  IconButton,
  MenuItem,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import { toast } from "react-toastify";  // Import toast
import 'react-toastify/dist/ReactToastify.css';  // Import Toastify styles
import { ToastContainer } from 'react-toastify';
// import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';

const NewProduct = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | undefined>();
  const [category, setCategory] = useState<string>("");
  const [shippingDays, setShippingDays] = useState<number>(15); // Default value


  const [stock, setStock] = useState<number | undefined>();
  const [brand, setBrand] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [ratings, setRatings] = useState<number | undefined>();
  const [productSold, setProductSold] = useState<number | undefined>();
  const [productWatched, setProductWatched] = useState<number | undefined>();
  const [onSale, setOnSale] = useState<boolean>(false);
  const [detailsDescription, setDetailsDescription] = useState<string>("");
  const [features, setFeatures] = useState<string[]>([""]);

  const categories = [
    "Educational Toys",
    "Curriculum Books",
    "Arduino Robots",
    "Lego Robots",
    "Others",
  ];


  const marks = [
    {
      value: 7,
      label: '7',
    },
    {
      value: 15,
      label: '15',
    },
    {
      value: 30,
      label: '30',
    },
    {
      value: 45,
      label: '45',
    },
    {
      value: 60,
      label: '60',
    },
  ];

  function valuetext(value: number) {
    return `${value}°C`;
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const updatedImages = [...images];
      updatedImages[index] = file;
      setImages(updatedImages);

      const reader = new FileReader();
      reader.onloadend = () => {
        const updatedPreviews = [...previews];
        updatedPreviews[index] = reader.result as string;
        setPreviews(updatedPreviews);
      };
      reader.readAsDataURL(file);
    }
  };

  const addImage = () => {
    setImages([...images, null as unknown as File]);
    setPreviews([...previews, ""]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (value: string, index: number) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
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
    formData.append("onSale", onSale ? "yes" : "no");
    formData.append("shippingDays", shippingDays.toString());
    formData.append("detailsDescription", detailsDescription);
    features.forEach((feature) => formData.append("features", feature));
    images.forEach((image, index) => {
      if (image) formData.append(`image${index}`, image);
    });

    try {
      const response = await axios.post("http://localhost:8080/addProduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product submitted successfully!"); // Success toast
      console.log("Product submitted successfully:", response.data);
    } catch (error) {
      toast.error("Error submitting product!"); // Error toast
      console.error("Error submitting product:", error);
    }
  };

  return (
    <Box display="flex">
      <AdminSidebar />
      <Box component="main" p={4} width="100%">
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h4" mb={3}>
            New Product
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Product Name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Short Description"
                  required
                  multiline
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Price"
                  required
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Stock"
                  required
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  select
                  fullWidth
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
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
              <Grid item xs={6}>
              <Typography variant="h6">Shipping of Product (Days)</Typography>
                <Slider
                  aria-label="Restricted values"
                  defaultValue={15}
                  getAriaValueText={valuetext}
                  step={null}
                  valueLabelDisplay="auto"
                  marks={marks}
                  min={7}  // Set minimum value
                  max={60} // Set maximum value
                  onChange={(e, newValue) => setShippingDays(newValue as number)} // Update state on change
                  
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Details Description"
                  multiline
                  rows={4}
                  value={detailsDescription}
                  onChange={(e) => setDetailsDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Fits and Features</Typography>
                {features.map((feature, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={2} mb={2}>
                    <TextField
                      fullWidth
                      label={`Feature ${index + 1}`}
                      value={feature}
                      onChange={(e) => handleFeatureChange(e.target.value, index)}
                    />
                    <IconButton onClick={() => removeFeature(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button onClick={addFeature}>Add Fits and Feature</Button>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Images</Typography>
                {previews.map((preview, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={2} mb={2}>
                    {preview && <img src={preview} alt="preview" width={100} />}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageChange(e, index)}
                    />
                    <IconButton onClick={() => removeImage(index)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button onClick={addImage}>Add Image</Button>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default NewProduct;
