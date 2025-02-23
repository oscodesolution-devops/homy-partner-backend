import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import connectToDb from './src/connections/DbController.js'
import chefsRoutes from './src/routes/chefsRoutes.js'
import orderRoutes from './src/routes/orderscheckRoutes.js'
import uploadToCloudinary from './src/connections/cloudinary.config.js';

dotenv.config({
    path:'./.env'
})
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.post('/api/upload', async (req, res) => {
    try {
        const { imageData, folder } = req.body;

        if (!imageData || !folder) {
            return res.status(400).json({ message: "Image data and folder are required" });
        }

        // Verify that the image data is a valid base64 string
        if (!imageData.startsWith('data:image')) {
            return res.status(400).json({ message: "Invalid image format" });
        }

        // Upload to cloudinary
        const uploadResponse = await uploadToCloudinary(imageData, folder);

        res.status(200).json({
            message: "Image uploaded successfully",
            imageUrl: uploadResponse
        });

    } catch (error) {
        console.error("Error uploading image:", error);
        res.status(500).json({ message: "An error occurred while uploading the image", error: error.message });
    }
});

app.use('/api/auth', chefsRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', function (req, res) {
  res.send('Hello World')
})

app.listen(PORT, () => {
    connectToDb();
    console.log(`Server is running on http://localhost:${PORT}`);
});