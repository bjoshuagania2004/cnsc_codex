// server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing for incoming requests
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure storage for uploaded files using Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Files will be saved to the "uploads" folder
  },
  filename: (req, file, cb) => {
    // Create a unique filename using a timestamp and random number
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// For demonstration purposes, we store organization data in memory.
// In a production app, you would store this data in a database.
const organizations = [];

/**
 * POST /api/organization
 * Receives organization and adviser information from the form.
 */
app.post("/api/organization", (req, res) => {
  const organizationData = req.body;
  // Save the organization data (here we push it to an array)
  organizations.push(organizationData);
  res.status(201).json({
    message: "Organization data saved successfully",
    organizationData,
  });
});

/**
 * POST /api/upload
 * Handles file uploads for the multi-step form.
 * The endpoint accepts any number of files from any fields.
 */
app.post("/api/upload", upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  // Build a response that maps each file field to its file info.
  const filesInfo = {};
  req.files.forEach((file) => {
    filesInfo[file.fieldname] = {
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      size: file.size,
    };
  });

  res.status(200).json({
    message: "Files uploaded successfully",
    files: filesInfo,
  });
});

/**
 * POST /api/finalSubmit
 * Receives the final submission, which could include reviewed organization data
 * and information about uploaded files.
 */
app.post("/api/finalSubmit", (req, res) => {
  const finalSubmission = req.body;
  // In a real application, you might combine this with your previously saved
  // organization data and files, and then persist it to a database.
  console.log("Final submission received:", finalSubmission);
  res.status(200).json({
    message: "Final submission received successfully",
    finalSubmission,
  });
});

// Serve files from the uploads folder (if you need to access them later)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
