import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import axios from "axios";
import { Link } from "react-router-dom";
interface Video {
	id: string;
	name: string;
	description: string;
	link: string; // Replace File | null with string
}

interface Section {
	id: string;
	name: string;
	description: string;
	videos: Video[];
}

interface Course {
	title: string;
	description: string;
	instructor: string;
	duration: number;
	price: number;
	category: string;
	level: string;
	students: string[];
	sections: Section[];
}

const UpdateCourse = () => {

	const { id: courseId } = useParams<{ id: string }>();
	const [title, setTitle] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [instructor, setInstructor] = useState<string>(""); // Instructor ID
	const [duration, setDuration] = useState<number>(0);
	const [price, setPrice] = useState<number>(0);
	const [category, setCategory] = useState<string>("course");
	const [level, setLevel] = useState<string>("Beginner");
	const [students, setStudents] = useState<string[]>([]); // Array of student IDs
	const [sections, setSections] = useState<Section[]>([]);
	const [image, setImage] = useState<File | null>(null); // For image file
	const [imageUrl, setImageUrl] = useState<string>(""); // For displaying image URL


	useEffect(() => {
		const fetchCourseDetails = async () => {
			try {
				const response = await axios.get(`http://localhost:8080/courses/${courseId}`);
				const courseData = response.data;
				setTitle(courseData.data.title || "");
				setDescription(courseData.data.description || "");
				setInstructor(courseData.data.instructor || "");
				setDuration(courseData.data.duration || 0);
				setPrice(courseData.data.price || 0);
				setCategory(courseData.data.category || "");
				setLevel(courseData.data.level || "");
				setStudents(courseData.data.students || []);
				setSections(courseData.data.sections || []);
				setImageUrl(courseData.data.image.url || ""); // Set the existing image URL
			} catch (error) {
				console.error("Error fetching course details:", error);
			}
		};

		fetchCourseDetails();
	}, [courseId]);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		setImage(file || null); // Handle undefined case and set as null

		if (file) {
			setImageUrl(URL.createObjectURL(file)); // Set preview URL
		} else {
			setImageUrl(""); // Reset preview URL if no file is selected
		}
	};


	const handleSubmit = async (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
	
		try {
			console.log("Submitting form data...");
	
			// Prepare the formData
			const formData = new FormData();
			formData.append("title", title);
			formData.append("description", description);
			formData.append("instructor", instructor);
			formData.append("duration", duration.toString());
			formData.append("price", price.toString());
			formData.append("category", category);
			formData.append("level", level);
			formData.append("students", JSON.stringify(students));
			formData.append("sections", JSON.stringify(sections));
	
			if (image) {
				formData.append("image", image); // Append image file to form data
			}
	
			// Log formData to verify all data is appended correctly
			formData.forEach((value, key) => {
				console.log(`${key}:`, value);
			});
	
			// Send request
			const response = await axios.put(`http://localhost:8080/courses/${courseId}`, formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
	
			console.log("Course updated successfully:", response.data);
			alert("Course updated successfully!");
		} catch (error) {
			console.error("Error updating course:", error);
			alert("Failed to update the course. Please try again.");
		}
	};
	
	
	


	const handleSectionChange = (index: number, field: "name" | "description", value: string) => {
		const updatedSections = [...sections];
		updatedSections[index][field] = value;
		setSections(updatedSections);
	};

	const handleVideoChange = (
		sectionIndex: number,
		videoIndex: number,
		field: "name" | "description" | "link",
		value: string
	) => {
		const updatedSections = [...sections];
		const updatedVideo = { ...updatedSections[sectionIndex].videos[videoIndex] };

		if (field === "link") {
			updatedVideo.link = value;
		} else {
			updatedVideo[field] = value;
		}

		updatedSections[sectionIndex].videos[videoIndex] = updatedVideo;
		setSections(updatedSections);
	};




	const addVideoToSection = (sectionIndex: number) => {
		const updatedSections = [...sections];
		updatedSections[sectionIndex].videos.push({
			id: uuidv4(),
			name: "",
			description: "",
			link: "", // Initialize with an empty string
		});
		setSections(updatedSections);
	};


	const removeVideoFromSection = (sectionIndex: number, videoIndex: number) => {
		const updatedSections = [...sections];
		updatedSections[sectionIndex].videos.splice(videoIndex, 1);
		setSections(updatedSections);
	};

	const addSection = () => {
		setSections([
			...sections,
			{
				id: uuidv4(),
				name: "",
				description: "",
				videos: [
					{
						id: uuidv4(),
						name: "",
						description: "",
						link: "", // Changed from file to link
					},
				],
			},
		]);
	};


	const removeSection = (index: number) => {
		const updatedSections = sections.filter((_, sectionIndex) => sectionIndex !== index);
		setSections(updatedSections);
	};

	return (
		<div className="admin-container">
			<AdminSidebar />
			<main className="product-management">
				<article>
					<form>
						<h2>Update Course</h2>
						{/* Image Upload */}
						<div>
							<label>Course Image</label>
							<input
								type="file"
								accept="image/*"
								onChange={handleImageChange}
							/>
							{imageUrl && (
								<div>
									<img
										src={imageUrl}
										alt="Uploaded Preview"
										style={{ width: "100px", height: "100px", marginTop: "10px" }}
									/>
								</div>
							)}
						</div>
						{/* Title */}
						<div>
							<label>Title</label>
							<input
								required
								type="text"
								placeholder="Course Title"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
							/>
						</div>

						{/* Description */}
						<div>
							<label>Description</label>
							<textarea
								required
								placeholder="Course Description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								style={{ width: "100%", height: "150px", padding: "16px" }}
							/>
						</div>

						{/* Instructor */}
						<div>
							<label>Instructor</label>
							<input
								required
								type="text"
								placeholder="Instructor ID (Reference)"
								value={instructor}
								onChange={(e) => setInstructor(e.target.value)}
							/>
						</div>

						{/* Duration */}
						<div>
							<label>Duration (in hours)</label>
							<input
								required
								type="number"
								placeholder="Duration"
								value={duration}
								onChange={(e) => setDuration(Number(e.target.value))}
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
								required
								value={category}
								onChange={(e) => setCategory(e.target.value)}
								style={{ width: "100%", height: "49px", padding: "16px" }}
							>
								<option value="course">Course</option>
								<option value="product">Product</option>
							</select>
						</div>

						{/* Level */}
						<div>
							<label>Level</label>
							<select
								required
								value={level}
								onChange={(e) => setLevel(e.target.value)}
								style={{ width: "100%", height: "49px", padding: "16px" }}
							>
								<option value="Beginner">Beginner</option>
								<option value="Intermediate">Intermediate</option>
								<option value="Advanced">Advanced</option>
							</select>
						</div>

						{/* Students */}
						<div>
							<label>Enrolled Students (IDs)</label>
							<input
								type="text"
								placeholder="Comma separated student IDs"
								value={students.join(", ")}
								onChange={(e) => setStudents(e.target.value.split(",").map((id) => id.trim()))}
							/>
						</div>

						{/* Sections */}
						<div>
							<h3>Sections</h3>
							{sections.map((section, sectionIndex) => (
								<div key={section.id} style={{ marginBottom: "16px", border: "1px solid #ccc", padding: "16px" }}>
									<h4>Section {sectionIndex + 1}</h4>
									<div>
										<label>Section Name</label>
										<input
											required
											type="text"
											value={section.name}
											onChange={(e) =>
												handleSectionChange(sectionIndex, "name", e.target.value)
											}
											placeholder="Section Name"
											style={{ width: "100%", height: "49px", padding: "10px", marginBottom: "16px" }}
										/>
									</div>
									<div>
										<label>Section Description</label>
										<textarea
											required
											value={section.description}
											onChange={(e) =>
												handleSectionChange(sectionIndex, "description", e.target.value)
											}
											placeholder="Section Description"
											style={{ width: "100%", height: "100px", padding: "10px", marginBottom: "16px" }}
										/>
									</div>

									{/* Videos */}
									<div>
										<h5>Videos</h5>
										{section.videos.map((video, videoIndex) => (
											<div
												key={video.id}
												style={{ marginBottom: "16px", border: "1px solid #eee", padding: "16px" }}
											>
												<div>
													<label>Video Name</label>
													<input
														type="text"
														value={video.name}
														onChange={(e) =>
															handleVideoChange(sectionIndex, videoIndex, "name", e.target.value)
														}
														placeholder="Video Name"
														style={{ width: "100%", height: "49px", padding: "10px", marginBottom: "8px" }}
													/>
												</div>
												<div>
													<label>Video Description</label>
													<textarea
														value={video.description}
														onChange={(e) =>
															handleVideoChange(sectionIndex, videoIndex, "description", e.target.value)
														}
														placeholder="Video Description"
														style={{
															width: "100%",
															height: "100px",
															padding: "10px",
															marginBottom: "8px",
														}}
													/>
												</div>
												<div>
													<label>Video Link</label>
													<input
														type="text"
														value={video.link}
														onChange={(e) =>
															handleVideoChange(sectionIndex, videoIndex, "link", e.target.value)
														}
														placeholder="Video Link"
														style={{ width: "100%", height: "49px", padding: "10px", marginBottom: "8px" }}
													/>
												</div>

												<button
													type="button"
													onClick={() => removeVideoFromSection(sectionIndex, videoIndex)}
													style={{
														padding: "8px 16px",
														backgroundColor: "#ff4d4d",
														color: "#fff",
														border: "none",
														borderRadius: "4px",
													}}
												>
													Remove Video
												</button>
											</div>
										))}
										<button
											type="button"
											onClick={() => addVideoToSection(sectionIndex)}
											style={{
												padding: "8px 16px",
												backgroundColor: "#4caf50",
												color: "#fff",
												border: "none",
												borderRadius: "4px",
											}}
										>
											Add Video
										</button>
									</div>

									{/* Remove Section */}
									<button
										type="button"
										onClick={() => removeSection(sectionIndex)}
										style={{
											marginTop: "16px",
											padding: "8px 16px",
											backgroundColor: "#f44336",
											color: "#fff",
											border: "none",
											borderRadius: "4px",
										}}
									>
										Remove Section
									</button>
								</div>
							))}
							<button
								type="button"
								onClick={addSection}
								style={{
									padding: "8px 16px",
									backgroundColor: "#2196f3",
									color: "#fff",
									border: "none",
									borderRadius: "4px",
									marginBottom: "16px",
								}}
							>
								Add New Section
							</button>
						</div>



						<Link
							to="#"
							onClick={handleSubmit}
							style={{
								display: "inline-block",
								padding: "10px 20px",
								backgroundColor: "#4caf50",
								color: "#fff",
								textDecoration: "none",
								borderRadius: "4px",
								marginTop: "20px",
								textAlign: "center",
							}}
						>
							Update Course
						</Link>
					</form>
				</article>
			</main>
		</div>
	);
};

export default UpdateCourse;
