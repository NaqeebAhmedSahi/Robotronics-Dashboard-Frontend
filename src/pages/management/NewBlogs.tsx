import React, { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import {
    TextField,
    Button,
    Typography,
    Box,
    Avatar,
    IconButton,
    Chip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const NewBlog = () => {
    const [bannerImage, setBannerImage] = useState<File | null>(null);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [categoryInput, setCategoryInput] = useState<string>("");
    const [title, setTitle] = useState<string>("");
    const [views, setViews] = useState<number>(0);
    const [shares, setShares] = useState<number>(0);
    const [paragraphs, setParagraphs] = useState<string[]>([]);
    const [paragraphInput, setParagraphInput] = useState<string>("");
    const [date, setDate] = useState<string>("");
    const [authorName, setAuthorName] = useState<string>("");
    const [authorImage, setAuthorImage] = useState<File | null>(null);
    const [authorImagePreview, setAuthorImagePreview] = useState<string | null>(null);
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState<string>("");

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setImage: React.Dispatch<React.SetStateAction<File | null>>, setPreview: React.Dispatch<React.SetStateAction<string | null>>) => {
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

    const handleAddToList = (input: string, setInput: React.Dispatch<React.SetStateAction<string>>, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (input.trim()) {
            setList((prevList) => [...prevList, input.trim()]);
            setInput("");
        }
    };

    const handleRemoveFromList = (itemToRemove: string, setList: React.Dispatch<React.SetStateAction<string[]>>) => {
        setList((prevList) => prevList.filter((item) => item !== itemToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("bannerImage", bannerImage || "");
        formData.append("thumbnailImage", thumbnailImage || "");
        formData.append("categories", JSON.stringify(categories));
        formData.append("title", title);
        formData.append("views", views.toString());
        formData.append("shares", shares.toString());
        formData.append("paragraphs", JSON.stringify(paragraphs));
        formData.append("date", date);
        formData.append("authorName", authorName);
        formData.append("authorImage", authorImage || "");
        formData.append("tags", JSON.stringify(tags));

        try {
            const response = await axios.post("http://localhost:8080/addBlog", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            console.log("Blog submitted successfully", response.data);
        } catch (error) {
            console.error("Error submitting data", error);
        }
    };

    return (
        <div className="admin-container">
            <AdminSidebar />
            <main className="blog-management">
                <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        New Blog
                    </Typography>

                    {/* Banner Image */}
                    <Box sx={{ mb: 2 }}>
                        <Typography>Banner Image</Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, setBannerImage, setBannerPreview)}
                        />
                        {bannerPreview && (
                            <img
                                src={bannerPreview}
                                alt="Banner Preview"
                                style={{ maxWidth: "200px", marginTop: "10px" }}
                            />
                        )}
                    </Box>

                    {/* Thumbnail Image */}
                    <Box sx={{ mb: 2 }}>
                        <Typography>Thumbnail Image</Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, setThumbnailImage, setThumbnailPreview)}
                        />
                        {thumbnailPreview && (
                            <img
                                src={thumbnailPreview}
                                alt="Thumbnail Preview"
                                style={{ maxWidth: "200px", marginTop: "10px" }}
                            />
                        )}
                    </Box>

                    {/* Categories */}
                    <Box sx={{ mb: 2 }}>
                        <Typography>Categories</Typography>
                        <Box display="flex" alignItems="center">
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Add a category"
                                value={categoryInput}
                                onChange={(e) => setCategoryInput(e.target.value)}
                            />
                            <IconButton color="primary" onClick={() => handleAddToList(categoryInput, setCategoryInput, setCategories)}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                            {categories.map((category, index) => (
                                <Chip
                                    key={index}
                                    label={category}
                                    onDelete={() => handleRemoveFromList(category, setCategories)}
                                    sx={{ mr: 1, mb: 1 }}
                                />
                            ))}
                        </Box>
                    </Box>

                    {/* Title */}
                    <TextField
                        label="Title"
                        variant="outlined"
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    {/* Views */}
                    <TextField
                        label="Views"
                        type="number"
                        variant="outlined"
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                        value={views}
                        onChange={(e) => setViews(Number(e.target.value))}
                    />

                    {/* Shares */}
                    <TextField
                        label="Shares"
                        type="number"
                        variant="outlined"
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                        value={shares}
                        onChange={(e) => setShares(Number(e.target.value))}
                    />

                    {/* Paragraphs */}
                    <Box sx={{ mb: 2 }}>
                        <Typography>Paragraphs</Typography>
                        <Box display="flex" alignItems="center">
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Add a paragraph"
                                value={paragraphInput}
                                onChange={(e) => setParagraphInput(e.target.value)}
                            />
                            <IconButton color="primary" onClick={() => handleAddToList(paragraphInput, setParagraphInput, setParagraphs)}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                            {paragraphs.map((paragraph, index) => (
                                <Typography key={index} sx={{ mb: 1 }}>
                                    {index + 1}. {paragraph}
                                </Typography>
                            ))}
                        </Box>
                    </Box>

                    {/* Date */}
                    <TextField
                        label="Date"
                        type="date"
                        variant="outlined"
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                        InputLabelProps={{ shrink: true }}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    {/* Author Name */}
                    <TextField
                        label="Author Name"
                        variant="outlined"
                        fullWidth
                        required
                        sx={{ mb: 2 }}
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                    />

                    {/* Author Image */}
                    <Box sx={{ mb: 2 }}>
                        <Typography>Author Image</Typography>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, setAuthorImage, setAuthorImagePreview)}
                        />
                        {authorImagePreview && (
                            <Avatar
                                src={authorImagePreview}
                                alt="Author Avatar Preview"
                                sx={{ width: 56, height: 56, mt: 2 }}
                            />
                        )}
                    </Box>

                    {/* Tags */}
                    <Box sx={{ mb: 2 }}>
                        <Typography>Tags</Typography>
                        <Box display="flex" alignItems="center">
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Add a tag"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                            />
                            <IconButton color="primary" onClick={() => handleAddToList(tagInput, setTagInput, setTags)}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Box sx={{ mt: 1 }}>
                            {tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    onDelete={() => handleRemoveFromList(tag, setTags)}
                                    sx={{ mr: 1, mb: 1 }}
                                />
                            ))}
                        </Box>

                    </Box>

                    <Button type="submit" variant="contained" color="primary">
                        Submit Blog
                    </Button>
                </Box>
            </main>
        </div>
    );
};

export default NewBlog;
