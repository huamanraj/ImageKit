require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/image/:fileId", async (req, res) => {
    const { fileId } = req.params;

    if (!fileId) {
        return res.status(400).json({ error: "File ID is required" });
    }

    try {
        const appwriteUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${process.env.APPWRITE_STORAGE_BUCKET_ID}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}`;

        
        const response = await axios.get(appwriteUrl, { responseType: "stream" });

      
        res.setHeader("Content-Type", response.headers["content-type"]);

        
        response.data.pipe(res);
    } catch (error) {
        console.error("Error fetching image:", error);
        res.status(500).json({ error: "Image fetch failed" });
    }
});

// For local development only
if (process.env.NODE_ENV !== 'production') {
    app.listen(process.env.PORT || 5000);
}

// Export for Vercel
module.exports = app;