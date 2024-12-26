import { useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";

const NewRoboGenius = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [monthlyPrice, setMonthlyPrice] = useState<number>();
  const [annualPrice, setAnnualPrice] = useState<number>();
  const [category, setCategory] = useState<"Programming" | "Marketing">("Programming");
  const [whatYouLearnDescription, setWhatYouLearnDescription] = useState<string>(""); // Paragraph for description
  const [skills, setSkills] = useState<string>(""); // Now a single string
  const [targetAudience, setTargetAudience] = useState<string>("");
  const [features, setFeatures] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState<number>();
  const [videoUrl, setVideoUrl] = useState<string>("");  // New state for video URL
  const [submittedData, setSubmittedData] = useState<any>(null);

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
  
    // Create an object for "what you'll learn" containing both the paragraph and skills
    const whatYouLearn = {
      description: whatYouLearnDescription,  // Paragraph for the "What You Will Learn"
      skills: skills,  // Skills as a string
    };
  
    // Log the data entry for debugging
    const dataEntry = {
      title,
      description,
      monthlyPrice,
      annualPrice,
      category,
      whatYouLearn,  // Include the object that contains description and skills
      targetAudience,
      features,
      image: image ? image.name : null,
      averageRating,
      videoUrl,  // Add videoUrl to dataEntry
    };
    console.log("Form Data as JSON:", dataEntry);
  
    try {
      // Log the data that will be sent to the backend
      console.log("Sending the following data to the backend:", dataEntry);
  
      // Prepare FormData to be sent to backend
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("monthlyPrice", monthlyPrice?.toString() || "");
      formData.append("annualPrice", annualPrice?.toString() || "");
      formData.append("category", category);
      formData.append("whatYouLearnDescription", whatYouLearn.description);  // Add the paragraph
      formData.append("skills", whatYouLearn.skills);  // Add skills as a string
      formData.append("targetAudience", targetAudience);
      formData.append("features", features);
      formData.append("averageRating", averageRating?.toString() || "");
      formData.append("videoUrl", videoUrl);  // Add videoUrl to formData
  
      if (image) {
        formData.append("image", image);
      }
  
      // Send data to the backend
      const response = await axios.post(
        "http://localhost:8080/addRoboGenius",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      console.log("Response from backend:", response.data);
      setSubmittedData(response.data); // Optionally save the response data
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
            <h2>New Data Entry</h2>

            <div>
              <label>Image</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {preview && (
                <div>
                  <p>Image Preview:</p>
                  <img
                    src={preview}
                    alt="Preview"
                    style={{ maxWidth: "200px", marginTop: "10px" }}
                  />
                </div>
              )}
            </div>

            <div>
              <label>Title</label>
              <input
                required
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

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

            <div>
              <label>Monthly Price</label>
              <input
                type="number"
                placeholder="Monthly Price"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Annual Price</label>
              <input
                type="number"
                placeholder="Annual Price"
                value={annualPrice}
                onChange={(e) => setAnnualPrice(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <select
                required
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value as "Programming" | "Marketing")
                }
                style={{
                  width: "100%",
                  height: "49px",
                  padding: "16px",
                }}
              >
                <option value="Programming">Programming</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            <div>
              <label>What You Learn (Description)</label>
              <textarea
                placeholder="What You Learn"
                value={whatYouLearnDescription}
                onChange={(e) => setWhatYouLearnDescription(e.target.value)}
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "16px",
                }}
              />
            </div>

            <div>
              <label>Skills</label>
              <textarea
                placeholder="Skills (Comma-separated)"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "16px",
                }}
              />
            </div>

            <div>
              <label>Target Audience</label>
              <textarea
                placeholder="Target Audience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "16px",
                }}
              />
            </div>

            <div>
              <label>Features</label>
              <textarea
                placeholder="Features"
                value={features}
                onChange={(e) => setFeatures(e.target.value)}
                style={{
                  width: "100%",
                  height: "100px",
                  padding: "16px",
                }}
              />
            </div>

            <div>
              <label>Average Rating</label>
              <input
                type="number"
                placeholder="Average Rating"
                value={averageRating}
                onChange={(e) => setAverageRating(Number(e.target.value))}
                min={1}
                max={5}
              />
            </div>

            <div>
              <label>Video URL</label>
              <input
                type="url"
                placeholder="Video URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>

            <button type="submit">Create Data Entry</button>
          </form>

          {submittedData && (
            <div>
              <h3>Data Submitted:</h3>
              <pre>{JSON.stringify(submittedData, null, 2)}</pre>
            </div>
          )}
        </article>
      </main>
    </div>
  );
};

export default NewRoboGenius;
