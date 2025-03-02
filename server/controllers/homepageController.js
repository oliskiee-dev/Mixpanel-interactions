const Homepage = require('../models/Homepage')

const path = require('path');
const fs = require('fs');

// Upload Image
exports.uploadImage = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    try {
        const newImage = new Homepage({
            image_url: req.file.filename, // Save only filename
            created_at: new Date(),
        });

        await newImage.save();
        res.status(201).json({ message: "Image uploaded successfully", image: newImage });
    } catch (error) {
        console.error("Error saving image:", error);
        res.status(500).json({ message: "Error saving image to database" });
    }
};

// Delete Image
exports.deleteImage = async (req, res) => {
    try {
        const { filename } = req.params;

        // Find and delete from MongoDB
        const deletedImage = await Homepage.findOneAndDelete({ image_url: filename });

        if (!deletedImage) {
            return res.status(404).json({ message: "Image not found in database" });
        }

        // Delete from server storage
        const filePath = path.join(__dirname, "homepage", filename);
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Error deleting file:", err);
                return res.status(500).json({ message: "Failed to delete file from server" });
            }
            res.json({ message: "Image deleted successfully" });
        });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ message: "Error deleting image" });
    }
};

// Get all images
exports.getAllImages = async (req, res) => {
    try {
        const images = await Homepage.find();
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving images" });
    }
};
