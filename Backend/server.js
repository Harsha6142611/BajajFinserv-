const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());

// Using multer to handle file uploads in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/bfhl', upload.single('file'), (req, res) => {
    // Parse 'data' directly from req.body assuming JSON structure has 'data' key
    const { data } = req.body;

    let numbers = [];
    let alphabets = [];
    let highestLowercaseAlphabet = '';

    // Check if 'data' is present and is an array
    if (data && Array.isArray(data)) {
        data.forEach(item => {
            if (!isNaN(item)) {
                numbers.push(item); // Collect numbers
            } else if (typeof item === 'string') {
                alphabets.push(item); // Collect alphabets
            }
        });

        // Filter lowercase alphabets and sort by Unicode values
        let lowercaseAlphabets = alphabets.filter(char => /^[a-z]$/.test(char)); // Filter only lowercase letters
        if (lowercaseAlphabets.length > 0) {
            // Sort lowercase letters by their Unicode (ASCII) value
            lowercaseAlphabets.sort((a, b) => a.localeCompare(b)); 
            highestLowercaseAlphabet = lowercaseAlphabets[lowercaseAlphabets.length - 1]; // Last item is the highest
        }
    }

    let isSuccess = data && Array.isArray(data); // Success is true if 'data' is a valid array
    let fileValid = false;
    let mimeType = '';
    let fileSizeKb = 0;

    // File handling logic
    if (req.file) {
        fileValid = true;
        mimeType = req.file.mimetype; // Get MIME type from multer's file object
        fileSizeKb = (req.file.size / 1024).toFixed(2); // Convert size to KB
    }

    res.status(200).json({
        "is_success": isSuccess,
        "user_id": "Harsha Pasupula",
        "email": "harsha_pasupula@srm.edu.in",
        "roll_number": "AP21110011450",
        "numbers": numbers,
        "alphabets": alphabets,
        "highest_lowercase_alphabet": highestLowercaseAlphabet, // Now correctly assigned
        "file_valid": fileValid,
        "file_mime_type": mimeType,
        "file_size_kb": fileSizeKb
    });
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({ "operation_code": 1 });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
