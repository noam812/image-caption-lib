import React, { useState } from "react";
import { generateImageCaption, CaptionConfig } from "../../src";

const ImageCaptioner: React.FC = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateCaption = async () => {
    setLoading(true);
    setError("");

    try {
      const config: CaptionConfig = {
        apiKey: process.env.REACT_APP_LLM_API_KEY!,
        language: "en",
      };

      const result = await generateImageCaption(imageUrl, config);
      setCaption(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Enter image URL"
      />
      <button onClick={generateCaption} disabled={loading}>
        Generate Caption
      </button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {caption && <p>{caption}</p>}
    </div>
  );
};

export default ImageCaptioner;
