import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Box,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Switch from "@mui/material/Switch"; // Import for toggle button
import { SelectChangeEvent } from "@mui/material";
type ContentType = {
  id: string;
  type: "video" | "audio" | "book" | "assignment";
  name: string;
  file: string | File | null;
};

type ModuleType = {
  id: string;
  name: string;
  contents: ContentType[];
};

type SectionType = {
  id: string;
  name: string;
  modules: ModuleType[];
};

const NewCourse = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  // Updated state
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  const [category, setCategory] = useState<string>("");
  const [reviews, setReviews] = useState<number>(0);
  const [date, setDate] = useState<string>("");
  const [studentsDownloaded, setStudentsDownloaded] = useState<number>(0);
  const [freeTrial, setFreeTrial] = useState<boolean>(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [whatYouLearn, setWhatYouLearn] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [sections, setSections] = useState<SectionType[]>([
    {
      id: uuidv4(),
      name: "",
      modules: [
        {
          id: uuidv4(),
          name: "",
          contents: [{ id: uuidv4(), type: "video", name: "", file: null }],
        },
      ],
    },
  ]);

  // Thumbnail and banner preview handlers
  const handleThumbnailChange = (file: File | null) => setThumbnail(file);
  const handleBannerChange = (file: File | null) => setBanner(file);
  const handleCategoryChange = (event: SelectChangeEvent<string>) => {
    setCategory(event.target.value as string);
  };

  const handleVideoChange = (file: File | null) => {
    setVideo(file);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Create FormData instance
    const formData = new FormData();
  
    // Append fields to FormData
    formData.append("title", title);
    formData.append("description", description);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    if (banner) formData.append("banner", banner);
    formData.append("category", category);
    formData.append("reviews", reviews.toString());
    formData.append("date", date);
    formData.append("studentsDownloaded", studentsDownloaded.toString());
    formData.append("freeTrial", freeTrial.toString());
    formData.append("features", JSON.stringify(features));
    formData.append("whatYouLearn", JSON.stringify(whatYouLearn));
    formData.append("options", JSON.stringify(options));
    if (video) formData.append("video", video);
  
    // Prepare and append sections as JSON
    const sectionsData = sections.map((section) => ({
      id: section.id,
      name: section.name,
      modules: section.modules.map((module) => ({
        id: module.id,
        name: module.name,
        contents: module.contents.map(({ id, type, name, file }) => {
          let contentFile;
  
          if (type === "video") {
            // If type is video, send URL as is
            contentFile = typeof file === "string" ? file : ""; // Default to empty string if no URL
          } else if (file instanceof File) {
            // For other types, include the backend file path for uploaded files
            contentFile = `/uploads/Courses/${file.name}`;
          } else if (typeof file === "string") {
            // If the file is already a path, use it
            contentFile = file;
          }
  
          return { id, type, name, file: contentFile };
        }),
      })),
    }));
    formData.append("sections", JSON.stringify(sectionsData));
  
    // Append files for contents where `file` is a `File` object
    sections.forEach((section) => {
      section.modules.forEach((module) => {
        module.contents.forEach(({ file }) => {
          if (file instanceof File) {
            formData.append("files", file);
          }
        });
      });
    });
  
    // Debug: Log all FormData contents before sending to the backend
    console.log("FormData Contents:");
    for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`${key}: [File]`, value.name);
      } else {
        console.log(`${key}:`, value);
      }
    }
  
    try {
      // Send the form data to the backend
      const response = await axios.post("http://localhost:8080/create-course", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // Notify user on success
      toast.success("Course successfully created!");
      console.log("Response:", response.data); // Debug: Log the server response
    } catch (error) {
      console.error("Error:", error); // Debug: Log the error
      toast.error("An error occurred while creating the course.");
    }
  };
  



  const addSection = () => {
    setSections([
      ...sections,
      {
        id: uuidv4(),
        name: "",
        modules: [
          { id: uuidv4(), name: "", contents: [{ id: uuidv4(), type: "video", name: "", file: null }] },
        ],
      },
    ]);
  };

  const removeSection = (sectionIndex: number) => {
    setSections(sections.filter((_, index) => index !== sectionIndex));
  };

  const addModule = (sectionIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].modules.push({
      id: uuidv4(),
      name: "",
      contents: [{ id: uuidv4(), type: "video", name: "", file: null }],
    });
    setSections(updatedSections);
  };

  const removeModule = (sectionIndex: number, moduleIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].modules.splice(moduleIndex, 1);
    setSections(updatedSections);
  };

  const addContent = (sectionIndex: number, moduleIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].modules[moduleIndex].contents.push({
      id: uuidv4(),
      type: "video",
      name: "",
      file: null,
    });
    setSections(updatedSections);
  };

  const removeContent = (sectionIndex: number, moduleIndex: number, contentIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].modules[moduleIndex].contents.splice(contentIndex, 1);
    setSections(updatedSections);
  };

  const handleContentChange = (
    sectionIndex: number,
    moduleIndex: number,
    contentIndex: number,
    field: "name" | "type" | "file",
    value: string | File | null
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].modules[moduleIndex].contents[contentIndex][field] = value;
    setSections(updatedSections);
  };

  const handleSectionChange = (sectionIndex: number, field: "name", value: string) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex][field] = value;
    setSections(updatedSections);
  };

  const handleModuleChange = (sectionIndex: number, moduleIndex: number, field: "name", value: string) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].modules[moduleIndex][field] = value;
    setSections(updatedSections);
  };

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <form onSubmit={handleSubmit}>
          <Typography variant="h4" gutterBottom>
            New Course
          </Typography>
          <Grid container spacing={3}>
            {/* Title */}
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                label="Title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12} md={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Grid>

            {/* Thumbnail Upload with Preview */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Thumbnail Image</Typography>
              <Button variant="outlined" component="label" fullWidth>
                Upload Thumbnail
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleThumbnailChange(e.target.files?.[0] || null)}
                />
              </Button>
              {thumbnail && (
                <Box mt={2}>
                  <Typography variant="body2">Preview:</Typography>
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="Thumbnail Preview"
                    style={{ maxWidth: "100%", maxHeight: "150px" }}
                  />
                </Box>
              )}
            </Grid>

            {/* Banner Upload with Preview */}
            <Grid item xs={12} md={6}>
              <Typography variant="body1">Banner Image</Typography>
              <Button variant="outlined" component="label" fullWidth>
                Upload Banner
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleBannerChange(e.target.files?.[0] || null)}
                />
              </Button>
              {banner && (
                <Box mt={2}>
                  <Typography variant="body2">Preview:</Typography>
                  <img
                    src={URL.createObjectURL(banner)}
                    alt="Banner Preview"
                    style={{ maxWidth: "100%", maxHeight: "150px" }}
                  />
                </Box>
              )}
            </Grid>

            {/* Category Dropdown */}
            <Grid item xs={12} md={12}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select value={category} onChange={handleCategoryChange}>
                  <MenuItem value="Development">Development</MenuItem>
                  <MenuItem value="Design">Design</MenuItem>
                  <MenuItem value="Marketing">Marketing</MenuItem>
                  <MenuItem value="Business">Business</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Reviews */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Reviews"
                type="number"
                value={reviews}
                onChange={(e) => setReviews(Number(e.target.value))}
              />
            </Grid>

            {/* Date */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Grid>

            {/* Students Downloaded */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Students Downloaded"
                type="number"
                value={studentsDownloaded}
                onChange={(e) => setStudentsDownloaded(Number(e.target.value))}
              />
            </Grid>

            {/* Free Trial Toggle */}
            <Grid item xs={12} md={6}>
              <Box display="flex" alignItems="center">
                <Typography variant="body1" style={{ marginRight: "16px" }}>
                  Free Trial Available
                </Typography>
                <Switch
                  checked={freeTrial}
                  onChange={(e) => setFreeTrial(e.target.checked)}
                />
              </Box>
            </Grid>

            {/* Video Upload with Preview */}
            <Grid item xs={12} md={12}>
              <Typography variant="body1">Upload Video</Typography>
              <Button variant="outlined" component="label" fullWidth>
                Upload Video
                <input
                  type="file"
                  accept="video/*"
                  hidden
                  onChange={(e) => handleVideoChange(e.target.files?.[0] || null)}
                />
              </Button>
              {video && (
                <Box mt={2}>
                  <Typography variant="body2">Video Preview:</Typography>
                  <video
                    controls
                    src={URL.createObjectURL(video)}
                    style={{ maxWidth: "100%", maxHeight: "300px" }}
                  />
                </Box>
              )}
            </Grid>
          </Grid>


          {/* Features */}
          <Box mb={2}>
            <Typography variant="h6">Features</Typography>
            {features.map((feature, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <TextField
                  fullWidth
                  value={feature}
                  onChange={(e) => {
                    const updatedFeatures = [...features];
                    updatedFeatures[index] = e.target.value;
                    setFeatures(updatedFeatures);
                  }}
                />
                <IconButton color="error" onClick={() => setFeatures(features.filter((_, i) => i !== index))}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={() => setFeatures([...features, ""])}
            >
              Add Feature
            </Button>
          </Box>

          {/* What You Learn */}
          <Box mb={2}>
            <Typography variant="h6">What You Learn</Typography>
            {whatYouLearn.map((item, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <TextField
                  fullWidth
                  value={item}
                  onChange={(e) => {
                    const updatedList = [...whatYouLearn];
                    updatedList[index] = e.target.value;
                    setWhatYouLearn(updatedList);
                  }}
                />
                <IconButton color="error" onClick={() => setWhatYouLearn(whatYouLearn.filter((_, i) => i !== index))}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={() => setWhatYouLearn([...whatYouLearn, ""])}
            >
              Add Item
            </Button>
          </Box>

          {/* Options */}
          <Box mb={2}>
            <Typography variant="h6">Options</Typography>
            {options.map((option, index) => (
              <Box key={index} display="flex" alignItems="center" mb={1}>
                <TextField
                  fullWidth
                  value={option}
                  onChange={(e) => {
                    const updatedOptions = [...options];
                    updatedOptions[index] = e.target.value;
                    setOptions(updatedOptions);
                  }}
                />
                <IconButton color="error" onClick={() => setOptions(options.filter((_, i) => i !== index))}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={() => setOptions([...options, ""])}
            >
              Add Option
            </Button>
          </Box>

          <Typography variant="h5" gutterBottom>
            Modules
          </Typography>
          {sections.map((section, sectionIndex) => (
            <Accordion key={section.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box sx={{ m: 1 }}>
                  <Typography>Module {sectionIndex + 1}</Typography>
                </Box>
                <IconButton

                  color="error"
                  onClick={() => removeSection(sectionIndex)}
                  title="Delete Section"
                >
                  <DeleteIcon />
                </IconButton>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Module Name"
                      value={section.name}
                      onChange={(e) => handleSectionChange(sectionIndex, "name", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ m: 5 }}>
                    {section.modules.map((module, moduleIndex) => (
                      <Accordion key={module.id}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                          <Box sx={{ m: 1 }}>
                            <Typography>Lecture {moduleIndex + 1}</Typography>
                          </Box>
                          <IconButton
                            color="error"
                            onClick={() => removeModule(sectionIndex, moduleIndex)}
                            title="Delete Module"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Lecture Name"
                                value={module.name}
                                onChange={(e) =>
                                  handleModuleChange(sectionIndex, moduleIndex, "name", e.target.value)
                                }
                              />
                            </Grid>
                            <Grid item xs={12}>
                              {module.contents.map((content, contentIndex) => (
                                <Grid container spacing={2} key={content.id}>
                                  <Grid item xs={2} sx={{ m: 2 }}>
                                    <FormControl fullWidth>
                                      <InputLabel>Type</InputLabel>
                                      <Select
                                        value={content.type}
                                        onChange={(e) =>
                                          handleContentChange(
                                            sectionIndex,
                                            moduleIndex,
                                            contentIndex,
                                            "type",
                                            e.target.value
                                          )
                                        }
                                      >
                                        <MenuItem value="video">Video</MenuItem>
                                        <MenuItem value="audio">Audio</MenuItem>
                                        <MenuItem value="book">Book</MenuItem>
                                        <MenuItem value="assignment">Assignment</MenuItem>
                                      </Select>
                                    </FormControl>
                                  </Grid>
                                  <Grid item xs={3} sx={{ my: 2 }}>
                                    <TextField
                                      fullWidth
                                      label="Content Name"
                                      value={content.name}
                                      onChange={(e) =>
                                        handleContentChange(
                                          sectionIndex,
                                          moduleIndex,
                                          contentIndex,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </Grid>
                                  {/* Conditional rendering based on content type */}
                                  {content.type === "video" && (
                                    <Grid item xs={4} sx={{ m: 2 }}>
                                      <TextField
                                        fullWidth
                                        label="YouTube URL"
                                        placeholder="Enter YouTube URL"
                                        value={typeof content.file === "string" ? content.file : ""}
                                        onChange={(e) =>
                                          handleContentChange(
                                            sectionIndex,
                                            moduleIndex,
                                            contentIndex,
                                            "file",
                                            e.target.value
                                          )
                                        }
                                      />
                                    </Grid>
                                  )}
                                  {(content.type === "audio" ||
                                    content.type === "book" ||
                                    content.type === "assignment") && (
                                      <Grid item xs={4} sx={{ m: 2 }}>
                                        <Button
                                          variant="outlined"
                                          component="label"
                                          fullWidth
                                        >
                                          Upload File
                                          <input
                                            type="file"
                                            accept={
                                              content.type === "audio"
                                                ? "audio/*"
                                                : content.type === "book"
                                                  ? ".pdf,.doc,.docx"
                                                  : content.type === "assignment"
                                                    ? ".pdf,.doc,.docx,.txt"
                                                    : "*"
                                            }
                                            hidden
                                            onChange={(e) =>
                                              handleContentChange(
                                                sectionIndex,
                                                moduleIndex,
                                                contentIndex,
                                                "file",
                                                e.target.files?.[0] || null
                                              )
                                            }
                                          />
                                        </Button>
                                      </Grid>
                                    )}
                                  <Grid item xs={1} sx={{ m: 2.8 }}>
                                    <IconButton
                                      color="error"
                                      onClick={() =>
                                        removeContent(sectionIndex, moduleIndex, contentIndex)
                                      }
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              ))}
                            </Grid>

                            <Grid item xs={12}>
                              <Button
                                variant="contained"
                                startIcon={<AddCircleIcon />}
                                onClick={() => addContent(sectionIndex, moduleIndex)}
                              >
                                Add Content
                              </Button>
                            </Grid>
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      startIcon={<AddCircleIcon />}
                      onClick={() => addModule(sectionIndex)}
                    >
                      Add Lecture
                    </Button>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}

          <Box mt={2}>
            <Button
              variant="contained"
              startIcon={<AddCircleIcon />}
              onClick={addSection}
            >
              Add Module
            </Button>
          </Box>
          <Box mt={4}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Create Course
            </Button>
          </Box>
        </form>
        <ToastContainer />
      </main>
    </div>
  );
};

export default NewCourse;