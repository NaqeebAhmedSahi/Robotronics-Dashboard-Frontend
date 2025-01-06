import { ChangeEvent, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import axios from "axios";

const NewVideoGallery = () => {
  const [workshopName, setWorkshopName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [timeFrom, setTimeFrom] = useState<string>("");
  const [timeTo, setTimeTo] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<any>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Create FormData object and append all fields
    const formData = new FormData();
    formData.append("workshopName", workshopName);
    formData.append("description", description);
    formData.append("timeFrom", timeFrom);
    formData.append("timeTo", timeTo);
  
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
  
    try {
      const response = await axios.post("http://localhost:8080/addVideoGallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",  // Ensure correct header for file upload
        },
      });
  
      // Handle the response from the backend
      console.log(response.data);
      setSubmittedData(response.data.video);
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
            <h2>New Video</h2>

            {/* Thumbnail */}
            <div>
              <label>Thumbnail</label>
              <input type="file" accept="image/*" onChange={handleThumbnailChange} />
              {preview && (
                <div>
                  <p>Thumbnail Preview:</p>
                  <img src={preview} alt="Thumbnail Preview" style={{ maxWidth: "200px", marginTop: "10px" }} />
                </div>
              )}
            </div>

            {/* Workshop Name */}
            <div>
              <label>Workshop Name</label>
              <input
                required
                type="text"
                placeholder="Workshop Name"
                value={workshopName}
                onChange={(e) => setWorkshopName(e.target.value)}
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

            {/* Time From */}
            <div>
              <label>Time From</label>
              <input
                required
                type="time"
                value={timeFrom}
                onChange={(e) => setTimeFrom(e.target.value)}
              />
            </div>

            {/* Time To */}
            <div>
              <label>Time To</label>
              <input
                required
                type="time"
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
              />
            </div>

            <button type="submit">Create Video</button>
          </form>

          {/* Display submitted data */}
          {submittedData && (
            <div>
              <h3>Video Submitted:</h3>
              <pre>{JSON.stringify(submittedData, null, 2)}</pre>
            </div>
          )}
        </article>
      </main>
    </div>
  );
};

export default NewVideoGallery;
