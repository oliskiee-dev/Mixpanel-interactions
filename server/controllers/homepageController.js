const Homepage = require('../models/Homepage')

const path = require('path');
const fs = require('fs');

// Upload Image
// exports.uploadImage = async (req, res) => {
//     if (!req.file) return res.status(400).json({ message: "No file uploaded" });

//     try {
//         const newImage = new Homepage({
//             image_url: req.file.filename, // Save only filename
//             created_at: new Date(),
//         });

//         await newImage.save();
//         res.status(201).json({ message: "Image uploaded successfully", image: newImage });
//     } catch (error) {
//         console.error("Error saving image:", error);
//         res.status(500).json({ message: "Error saving image to database" });
//     }
// };


exports.uploadImage = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    try {
        // Read file and convert to Base64
        const imageBuffer = fs.readFileSync(req.file.path);
        const base64Image = imageBuffer.toString("base64");

        const newImage = new Homepage({
            image_data: base64Image,
            created_at: new Date(),
        });

        await newImage.save();

        // Optionally, remove the uploaded file from the server after saving
        fs.unlinkSync(req.file.path);

        res.status(201).json({ message: "Image uploaded successfully", image: newImage });
    } catch (error) {
        console.error("Error saving image:", error);
        res.status(500).json({ message: "Error saving image to database" });
    }
};


// Delete Image
// exports.deleteImage = async (req, res) => {
//     try {
//         const { filename } = req.params;

//         // Find and delete from MongoDB
//         const deletedImage = await Homepage.findOneAndDelete({ image_url: filename });

//         if (!deletedImage) {
//             return res.status(404).json({ message: "Image not found in database" });
//         }

//         // Delete from server storage
//         const filePath = path.join(__dirname, "../homepage", filename);
//         fs.unlink(filePath, (err) => {
//             if (err) {
//                 console.error("Error deleting file:", err);
//                 return res.status(500).json({ message: "Failed to delete file from server" });
//             }
//             res.json({ message: "Image deleted successfully" });
//         });
//     } catch (error) {
//         console.error("Error deleting image:", error);
//         res.status(500).json({ message: "Error deleting image" });
//     }
// };

exports.deleteImage = async (req, res) => {
    try {
        const { id } = req.params; // Use ID instead of filename

        // Find and delete from MongoDB
        const deletedImage = await Homepage.findByIdAndDelete(id);

        if (!deletedImage) {
            return res.status(404).json({ message: "Image not found in database" });
        }

        res.json({ message: "Image deleted successfully" });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ message: "Error deleting image" });
    }
};


// Get all images
// exports.getAllImages = async (req, res) => {
//     try {
//         const images = await Homepage.find();
//         res.json(images);
//     } catch (error) {
//         res.status(500).json({ message: "Error retrieving images" });
//     }
// };

exports.getAllImages = async (req, res) => {
    try {
        const images = await Homepage.find();
        res.json(images);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving images" });
    }
};
