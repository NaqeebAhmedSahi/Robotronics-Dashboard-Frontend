import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import { Container, TextField, Button, Grid, Typography, Box, Card, CardContent, CardActions, Select, MenuItem, InputLabel, FormControl, IconButton, Divider } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

const UpdateCourse = () => {
	const { id: courseId } = useParams<{ id: string }>();

	const [courseData, setCourseData] = useState<any>({
		title: "",
		description: "",
		category: "",
		reviews: 0,
		date: "",
		studentsDownloaded: 0,
		freeTrial: false,
		features: [],
		whatYouLearn: [],
		options: [],
		thumbnail: "",
		banner: "",
		video: "",
		sections: [],
	});

	useEffect(() => {
		const fetchCourseDetails = async () => {
			try {
				const response = await axios.get(`http://localhost:8080/courses/${courseId}`);
				const { courses } = response.data;
				setCourseData(courses);
			} catch (error) {
				console.error("Error fetching course details:", error);
			}
		};

		fetchCourseDetails();
	}, [courseId]);

	const handleInputChange = (field: string, value: any) => {
		setCourseData((prev: any) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSectionChange = (index: number, key: string, value: any) => {
		const updatedSections = [...courseData.sections];
		updatedSections[index][key] = value;
		setCourseData((prev: any) => ({
			...prev,
			sections: updatedSections,
		}));
	};

	const handleSubmit = async () => {
		try {
			const response = await axios.put(`http://localhost:8080/courses/${courseId}`, courseData);
			alert("Course updated successfully!");
			console.log("Response:", response.data);
		} catch (error) {
			console.error("Error updating course:", error);
			alert("Failed to update the course. Please try again.");
		}
	};

	const addSection = () => {
		setCourseData((prev: any) => ({
			...prev,
			sections: [
				...prev.sections,
				{ id: uuidv4(), name: "", modules: [{ id: uuidv4(), name: "", contents: [] }] },
			],
		}));
	};

	const removeSection = (index: number) => {
		const updatedSections = courseData.sections.filter((_: any, i: number) => i !== index);
		setCourseData((prev: any) => ({
			...prev,
			sections: updatedSections,
		}));
	};

	return (
		<Container maxWidth="lg">
			<Typography variant="h4" gutterBottom>
				Update Course
			</Typography>
			<Box sx={{ mt: 4 }}>
				<Grid container spacing={4}>
					<Grid item xs={12}>
						<TextField
							label="Title"
							fullWidth
							value={courseData.title}
							onChange={(e) => handleInputChange("title", e.target.value)}
						/>
					</Grid>
					<Grid item xs={12}>
						<TextField
							label="Description"
							fullWidth
							multiline
							rows={4}
							value={courseData.description}
							onChange={(e) => handleInputChange("description", e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Category"
							fullWidth
							value={courseData.category}
							onChange={(e) => handleInputChange("category", e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Reviews"
							type="number"
							fullWidth
							value={courseData.reviews}
							onChange={(e) => handleInputChange("reviews", e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Students Downloaded"
							type="number"
							fullWidth
							value={courseData.studentsDownloaded}
							onChange={(e) => handleInputChange("studentsDownloaded", e.target.value)}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							label="Date"
							type="date"
							fullWidth
							InputLabelProps={{ shrink: true }}
							value={courseData.date.split("T")[0]}
							onChange={(e) => handleInputChange("date", e.target.value)}
						/>
					</Grid>
					<Grid item xs={12}>
						<Typography variant="h6">Sections</Typography>
						{courseData.sections.map((section: any, index: number) => (
							<Card key={section.id} sx={{ mb: 2 }}>
								<CardContent>
									<TextField
										label={`Section ${index + 1} Name`}
										fullWidth
										value={section.name}
										onChange={(e) => handleSectionChange(index, "name", e.target.value)}
									/>
									<Divider sx={{ my: 2 }} />
									{section.modules.map((module: any, modIndex: number) => (
										<Box key={module.id} sx={{ mb: 2 }}>
											<Typography variant="subtitle1">{`Module ${modIndex + 1}`}</Typography>
											<TextField
												label="Module Name"
												fullWidth
												value={module.name}
												onChange={(e) =>
													handleSectionChange(index, "modules", [
														...section.modules.slice(0, modIndex),
														{ ...module, name: e.target.value },
														...section.modules.slice(modIndex + 1),
													])
												}
												sx={{ mb: 2 }}
											/>
											{module.contents.map((content: any, contentIndex: number) => (
												<Box key={contentIndex} sx={{ pl: 2, mb: 1 }}>
													<Typography variant="body1">{`Content ${contentIndex + 1}`}</Typography>
													<TextField
														label="Content"
														fullWidth
														value={content.name}
														onChange={(e) =>
															handleSectionChange(index, "modules", [
																...section.modules.slice(0, modIndex),
																{
																	...module,
																	contents: [
																		...module.contents.slice(0, contentIndex),
																		e.target.value,
																		...module.contents.slice(contentIndex + 1),
																	],
																},
																...section.modules.slice(modIndex + 1),
															])
														}
													/>
												</Box>
											))}
											<Button
												variant="text"
												startIcon={<AddIcon />}
												onClick={() =>
													handleSectionChange(index, "modules", [
														...section.modules.slice(0, modIndex),
														{
															...module,
															contents: [...module.contents, ""], // Add a new empty content field
														},
														...section.modules.slice(modIndex + 1),
													])
												}
											>
												Add Content
											</Button>
										</Box>
									))}

								</CardContent>
								<CardActions>
									<IconButton color="error" onClick={() => removeSection(index)}>
										<DeleteIcon />
									</IconButton>
								</CardActions>
							</Card>
						))}
						<Button
							startIcon={<AddIcon />}
							variant="contained"
							onClick={addSection}
							sx={{ mt: 2 }}
						>
							Add Section
						</Button>
					</Grid>
					<Grid item xs={12}>
						<Button
							variant="contained"
							color="primary"
							onClick={handleSubmit}
							sx={{ mt: 2 }}
						>
							Update Course
						</Button>
					</Grid>
				</Grid>
			</Box>
		</Container>
	);
};

export default UpdateCourse;
