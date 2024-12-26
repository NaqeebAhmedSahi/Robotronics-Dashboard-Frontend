import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // This imports the default styles for Toastify


const NewCourse = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [instructor, setInstructor] = useState<string>(""); // Instructor ID
  const [duration, setDuration] = useState<number>();
  const [price, setPrice] = useState<number>();
  const [category, setCategory] = useState<"course" | "product">("course");
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [students, setStudents] = useState<string[]>([]); // Array of student IDs
  const [image, setImage] = useState<File | null>(null); // Add state for image
  const [preview, setPreview] = useState<string | null>(null);
  // const [link, setLink] = useState<File[]>([]); // To store uploaded files
  const [sections, setSections] = useState([
    { id: uuidv4(), name: "", description: "", videos: [{ id: uuidv4(), name: "", description: "", link: "" }] },
  ]);
  // To store dynamic fields for sections and videos

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Create a FormData object to handle binary file uploads
    const formData = new FormData();
  
    // Append fields to FormData
    formData.append("title", title);
    formData.append("description", description);
    formData.append("instructor", instructor);
    formData.append("duration", duration?.toString() || "");
    formData.append("price", price?.toString() || "");
    formData.append("category", category);
    formData.append("level", level);
    formData.append("students", JSON.stringify(students));
    if (image) {
      formData.append("image", image); // Append the file
    }
    formData.append(
      "sections",
      JSON.stringify(
        sections.map((section) => ({
          id: section.id,
          name: section.name,
          description: section.description,
          videos: section.videos.map(({ id, name, description, link }) => ({
            id,
            name,
            description,
            link,
          })),
        }))
      )
    );
  
    try {
      const response = await axios.post("http://localhost:8080/create-course", formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
  
      // Show success notification
      toast.success("Course successfully created!", {
        position: "top-right",
        autoClose: 5000,
      });
  
      console.log("Course successfully created:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(`Error: ${error.response?.data || error.message}`, {
          position: "top-right",
          autoClose: 5000,
        });
        console.error("Axios error:", error.response?.data || error.message);
      } else {
        toast.error("Unexpected error occurred!", {
          position: "top-right",
          autoClose: 5000,
        });
        console.error("Unexpected error:", error);
      }
    }
  };
  







  const addSection = () => {
    setSections([
      ...sections,
      { id: uuidv4(), name: "", description: "", videos: [{ id: uuidv4(), name: "", description: "", link: "" }] }, // Empty section with empty video fields
    ]);
  };

  const removeSection = (sectionIndex: number) => {
    const updatedSections = sections.filter((_, index) => index !== sectionIndex);
    setSections(updatedSections);
  };

  const handleSectionChange = (
    sectionIndex: number,
    field: "name" | "description",
    value: string
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex][field] = value;
    setSections(updatedSections);

  };

  const addVideo = (sectionIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].videos.push({
      id: uuidv4(),
      name: "",
      description: "",
      link: "", // Initialize with an empty string for the YouTube link
    });
    setSections(updatedSections);
  };


  const handleVideoChange = (
    sectionIndex: number,
    videoIndex: number,
    field: "name" | "description" | "link",
    value: string
  ) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].videos[videoIndex][field] = value;
    setSections(updatedSections);
  };



  const removeVideo = (sectionIndex: number, videoIndex: number) => {
    const updatedSections = [...sections];
    updatedSections[sectionIndex].videos.splice(videoIndex, 1);
    setSections(updatedSections);
  };

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


  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={handleSubmit}>
            <h2>New Course</h2>
            {/* Image */}
            <div>
              <label>Course Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {preview && (
                <div>
                  <p>Image Preview:</p>
                  <img src={preview} alt="Course Preview" style={{ maxWidth: "200px", marginTop: "10px" }} />
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
                style={{
                  width: "100%",
                  height: "150px",
                  padding: "16px",
                }}
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
                onChange={(e) => setCategory(e.target.value as "course" | "product")}
                style={{
                  width: "100%",
                  height: "49px",
                  padding: "16px",
                }}
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
                onChange={(e) => setLevel(e.target.value as "Beginner" | "Intermediate" | "Advanced")}
                style={{
                  width: "100%",
                  height: "49px",
                  padding: "16px",
                }}
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
                  <h4>Section</h4>

                  <div>
                    <div>
                      <label>Section Name</label>
                    </div>
                    <input
                      type="text"
                      value={section.name}
                      onChange={(e) => handleSectionChange(sectionIndex, "name", e.target.value)}
                      required
                      style={{
                        width: "100%",
                        height: "49px",
                        padding: "16px",
                      }}
                    />
                  </div>

                  <div>
                    <div>
                      <label>Section Description</label>
                    </div>
                    <textarea
                      value={section.description}
                      onChange={(e) => handleSectionChange(sectionIndex, "description", e.target.value)}
                      required
                      style={{
                        width: "100%",
                        height: "150px",
                        padding: "16px",
                      }}
                    />
                  </div>

                  <h5>Videos</h5>
                  {section.videos.map((video, videoIndex) => (
                    <div key={video.id} style={{ marginBottom: "16px" }}>
                      <div>
                        <label>Video Name</label>
                        <input
                          type="text"
                          value={video.name}
                          onChange={(e) =>
                            handleVideoChange(sectionIndex, videoIndex, "name", e.target.value)
                          }
                          required
                          style={{
                            width: "80%",
                            height: "49px",
                            padding: "16px",
                            margin: "0 auto",
                            display: "block",
                          }}
                        />
                      </div>

                      <div>
                        <label>Video Description</label>
                        <textarea
                          value={video.description}
                          onChange={(e) =>
                            handleVideoChange(sectionIndex, videoIndex, "description", e.target.value)
                          }
                          required
                          style={{
                            width: "80%",
                            height: "150px",
                            padding: "16px",
                            margin: "0 auto",
                            display: "block",
                          }}
                        />
                      </div>

                      <div>
                        <label>YouTube Link</label>
                        <input
                          type="url"
                          placeholder="Enter YouTube video link"
                          value={video.link}
                          onChange={(e) =>
                            handleVideoChange(sectionIndex, videoIndex, "link", e.target.value)
                          }
                          required
                          style={{
                            width: "80%",
                            height: "49px",
                            padding: "16px",
                            margin: "0 auto",
                            display: "block",
                          }}
                        />
                      </div>


                      {/* Add Video Button */}
                      <div>
                        <button
                          type="button"
                          onClick={() => removeVideo(sectionIndex, videoIndex)}
                          className="removeButton"
                        >
                          Remove Video
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add Video Button for Section */}
                  <div>
                    <button
                      type="button"
                      onClick={() => addVideo(sectionIndex)}
                      className="courseButton margin"
                    >
                      Add Video
                    </button>
                  </div>
                  {/* Remove Section Button */}
                  <div>
                    <button
                      type="button"
                      onClick={() => removeSection(sectionIndex)}
                      style={{ backgroundColor: "red", color: "white" }}
                      className="courseButton"
                    >
                      Remove Section

                    </button>
                  </div>
                </div>
              ))}
              <div>
                <button
                  type="button"
                  onClick={addSection}
                  className="courseButton"
                >
                  Add Section
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button type="submit" className="courseButton">Create Course</button>
            </div>
          </form>
        </article>
      </main>
      <ToastContainer />
    </div>
  );
};

export default NewCourse;