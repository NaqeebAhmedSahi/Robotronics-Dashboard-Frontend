import React, { useState, useEffect } from "react";
import { toast, ToastContainer  } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidv4 } from "uuid";
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
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Switch from "@mui/material/Switch"; // Import for toggle button
import { SelectChangeEvent } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// import DeleteIcon from "@mui/icons-material/Delete";

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

const CourseUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [reviews, setReviews] = useState<number>(0);
  const [studentsDownloaded, setStudentsDownloaded] = useState<number>(0);
  const [freeTrial, setFreeTrial] = useState<boolean>(false);
  const [features, setFeatures] = useState<string[]>([]);
  const [whatYouLearn, setWhatYouLearn] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [banner, setBanner] = useState<File | null>(null);
  
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/coursesById/${id}`
        );
        const data = response.data;
		console.log(data);
        setCourseData(data);
        setTitle(data.title);
        setDescription(data.description);
        setCategory(data.category);
        setReviews(data.reviews);
        setStudentsDownloaded(data.studentsDownloaded);
        setFreeTrial(data.freeTrial);
        setFeatures(data.features);
        setWhatYouLearn(data.whatYouLearn);
        setOptions(data.options);
        setThumbnailPreview(data.thumbnailUrl || null); // Set initial thumbnail preview
        setBannerPreview(data.bannerUrl || null); // Set initial banner preview

        // Set sections data
        if (data.sections) {
          const formattedSections = data.sections.map(
            (section: SectionType) => ({
              id: section.id,
              name: section.name,
              modules: section.modules.map((module: ModuleType) => ({
                id: module.id,
                name: module.name,
                contents: module.contents.map((content: ContentType) => ({
                  id: content.id,
                  type: content.type,
                  name: content.name,
                  file: content.file,
                })),
              })),
            })
          );
          setSections(formattedSections);
        //   console.log("Section ", sections);
        }
      } catch (error) {
        console.error("Error fetching course data", error);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleUpdate = async (e:React.FormEvent) => {
	e.preventDefault();
  
	const formData = new FormData();
	formData.append("title", title);
	formData.append("description", description);
	formData.append("category", category);
	formData.append("reviews", reviews.toString());
	formData.append("studentsDownloaded", studentsDownloaded.toString());
	formData.append("freeTrial", freeTrial.toString());
  
	// Append JSON stringified fields
	formData.append("features", JSON.stringify(features));
	formData.append("whatYouLearn", JSON.stringify(whatYouLearn));
	formData.append("options", JSON.stringify(options));
  
	// Append files if they exist
	if (thumbnail) formData.append("thumbnail", thumbnail);
	if (banner) formData.append("banner", banner);
  
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
			// If type is video, send URL or empty string
			contentFile = typeof file === "string" ? file : ""; // Default to empty string
		  } else if (file instanceof File) {
			// For other types, include the backend file path
			contentFile = `/uploads/Courses/${file.name}`;
		  } else if (typeof file === "string") {
			// If file is already a path, use it
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
  
	// Debug: Log all FormData contents before sending
	console.log("FormData Contents:");
	for (let [key, value] of formData.entries()) {
	  if (value instanceof File) {
		console.log(`${key}: [File]`, value.name);
	  } else {
		console.log(`${key}:`, value);
	  }
	}
  
	try {
	  // Send the PUT request to update the course
	  await axios.put(`http://localhost:8080/courses/${id}`, formData, {
		headers: {
		  "Content-Type": "multipart/form-data",
		},
	  });
	  navigate(`/admin/courses`, { state: { message: "Course updated successfully!" } });
	} catch (error) {
	  console.error("Error updating course:", error);
	  toast.error("Failed to update the course. Please try again.");
	}
  };
  

  const handleDeleteThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null); // Reset the preview image
  };

  const handleDeleteBanner = () => {
    setBanner(null);
    setBannerPreview(null); // Reset the preview image
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string); // Update the preview with the new image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setBanner(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string); // Update the preview with the new image
      };
      reader.readAsDataURL(file);
    }
  };

  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...features];
    updatedFeatures[index] = value;
    setFeatures(updatedFeatures);
  };

  const addWhatYouLearn = () => {
    setWhatYouLearn([...whatYouLearn, ""]);
  };

  const handleWhatYouLearnChange = (index: number, value: string) => {
    const updatedWhatYouLearn = [...whatYouLearn];
    updatedWhatYouLearn[index] = value;
    setWhatYouLearn(updatedWhatYouLearn);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addSection = () => {
    setSections([
      ...sections,
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

  const removeContent = (
    sectionIndex: number,
    moduleIndex: number,
    contentIndex: number
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].modules[moduleIndex].contents.splice(
      contentIndex,
      1
    );
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
    updatedSections[sectionIndex].modules[moduleIndex].contents[contentIndex][
      field
    ] = value;
    setSections(updatedSections);
  };

  const handleSectionChange = (
    sectionIndex: number,
    field: "name",
    value: string
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex][field] = value;
    setSections(updatedSections);
  };

  const handleModuleChange = (
    sectionIndex: number,
    moduleIndex: number,
    field: "name",
    value: string
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].modules[moduleIndex][field] = value;
    setSections(updatedSections);
  };

  if (!courseData) return <div>Loading...</div>;

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        Update Course: {courseData.title}
      </Typography>

      <form onSubmit={handleUpdate}>
        {/* Title */}
        <TextField
          label="Course Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* Description */}
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
          margin="normal"
        />

        {/* Category */}
        <TextField
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
          margin="normal"
        />

        {/* Reviews */}
        <TextField
          label="Reviews"
          type="number"
          value={reviews}
          onChange={(e) => setReviews(Number(e.target.value))}
          fullWidth
          margin="normal"
        />

        {/* Students Downloaded */}
        <TextField
          label="Students Downloaded"
          type="number"
          value={studentsDownloaded}
          onChange={(e) => setStudentsDownloaded(Number(e.target.value))}
          fullWidth
          margin="normal"
        />

        {/* Free Trial */}
        <FormControlLabel
          control={
            <Checkbox
              checked={freeTrial}
              onChange={(e) => setFreeTrial(e.target.checked)}
            />
          }
          label="Free Trial"
        />

        {/* Features */}
        <Typography variant="h6">Features</Typography>
        {features.map((feature, index) => (
          <TextField
            key={index}
            label={`Feature ${index + 1}`}
            value={feature}
            onChange={(e) => handleFeatureChange(index, e.target.value)}
            fullWidth
            margin="normal"
          />
        ))}
        <Button onClick={addFeature} variant="outlined" sx={{ marginTop: 2 }}>
          Add Feature
        </Button>

        {/* What You Will Learn */}
        <Typography variant="h6" mt={2}>
          What You Will Learn
        </Typography>
        {whatYouLearn.map((learn, index) => (
          <TextField
            key={index}
            label={`Learn ${index + 1}`}
            value={learn}
            onChange={(e) => handleWhatYouLearnChange(index, e.target.value)}
            fullWidth
            margin="normal"
          />
        ))}
        <Button
          onClick={addWhatYouLearn}
          variant="outlined"
          sx={{ marginTop: 2 }}
        >
          Add What You Will Learn
        </Button>

        {/* Options */}
        <Typography variant="h6" mt={2}>
          Options
        </Typography>
        {options.map((option, index) => (
          <TextField
            key={index}
            label={`Option ${index + 1}`}
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            fullWidth
            margin="normal"
          />
        ))}
        <Button onClick={addOption} variant="outlined" sx={{ marginTop: 2 }}>
          Add Option
        </Button>

        {/* Displaying Thumbnail Image from Backend */}
        <Grid container spacing={2} mt={2}>
          <Grid item xs={5}>
            <Typography variant="body2">Thumbnail</Typography>
            {thumbnailPreview ? (
              <Box position="relative" sx={{ marginBottom: 2 }}>
                <img
                  src={thumbnailPreview}
                  alt="Thumbnail"
                  style={{ width: "400px", maxHeight: "250px" }}
                />
                <IconButton
                  onClick={handleDeleteThumbnail}
                  color="error"
                  sx={{ position: "absolute", top: 10, right: 10 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ) : (
              courseData.thumbnail && (
                <Box position="relative" sx={{ marginBottom: 2 }}>
                  <img
                    src={`http://localhost:8080/${courseData.thumbnail}`}
                    alt="Thumbnail"
                    style={{ width: "300px", maxHeight: "250px" }}
                  />
                  <IconButton
                    onClick={handleDeleteThumbnail}
                    color="error"
                    sx={{ position: "absolute", top: 10, right: 10 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              style={{ display: "none" }}
              id="thumbnail-upload"
            />
            <label htmlFor="thumbnail-upload">
              <Button
                variant="outlined"
                component="span"
                sx={{ width: "100%" }}
              >
                Upload Thumbnail
              </Button>
            </label>
          </Grid>

          {/* Displaying Banner Image from Backend */}
          <Grid item xs={7}>
            <Typography variant="body2">Banner</Typography>
            {bannerPreview ? (
              <Box position="relative" sx={{ marginBottom: 2 }}>
                <img
                  src={bannerPreview}
                  alt="Banner"
                  style={{ width: "400px", maxHeight: "250px" }}
                />
                <IconButton
                  onClick={handleDeleteBanner}
                  color="error"
                  sx={{ position: "absolute", top: 10, right: 10 }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ) : (
              courseData.banner && (
                <Box position="relative" sx={{ marginBottom: 2 }}>
                  <img
                    src={`http://localhost:8080/${courseData.banner}`}
                    alt="Banner"
                    style={{ width: "400px", maxHeight: "250px" }}
                  />
                  <IconButton
                    onClick={handleDeleteBanner}
                    color="error"
                    sx={{ position: "absolute", top: 10, right: 10 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              )
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              style={{ display: "none" }}
              id="banner-upload"
            />
            <label htmlFor="banner-upload">
              <Button
                variant="outlined"
                component="span"
                sx={{ width: "100%" }}
              >
                Upload Banner
              </Button>
            </label>
          </Grid>
        </Grid>
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
                    onChange={(e) =>
                      handleSectionChange(sectionIndex, "name", e.target.value)
                    }
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
                          onClick={() =>
                            removeModule(sectionIndex, moduleIndex)
                          }
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
                                handleModuleChange(
                                  sectionIndex,
                                  moduleIndex,
                                  "name",
                                  e.target.value
                                )
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
                                      <MenuItem value="assignment">
                                        Assignment
                                      </MenuItem>
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
                                      value={
                                        typeof content.file === "string"
                                          ? content.file
                                          : ""
                                      }
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
                                                : "*" }
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
                                      removeContent(
                                        sectionIndex,
                                        moduleIndex,
                                        contentIndex
                                      )
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
                              onClick={() =>
                                addContent(sectionIndex, moduleIndex)
                              }
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

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ marginTop: 3 }}
        >
          Update Course
        </Button>
      </form>
	  <ToastContainer />
    </Box>);};export default CourseUpdate;
