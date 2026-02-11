const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.xml ? express.Router() : express.Router(); // Handle potential typos in some environments

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Construct the URL to the uploaded file
    // In a real app, this should be a configurable base URL
    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;

    res.json({
        message: 'File uploaded successfully',
        url: fileUrl
    });
});

module.exports = router;
