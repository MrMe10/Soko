// backend/server.js
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env.local') }); 
const express = require('express'); // Main app
const cors = require('cors'); //ByPasses security for browser 
const mongoose = require('mongoose');
const axios = require('axios');
const cheerio = require('cheerio');
const projectRoutes = require('./routes/projectRoutes');


const app = express();// Initializing the app
const PORT = process.env.PORT || 5000;


// Middleware
app.use(cors()); // Enables CORS
app.use(express.json()); // Allows us to parse JSON data
app.use('/api/projects', projectRoutes);


// Sample API Route
app.get('/', (req, res) => {
    res.send("Backend server is running perfectly and MongoDB is connected!");
});

app.get('/api/data', (_req, res) => {                                //GET for retreiving data from the server
    res.json({ message: "Hello from the Express backend!" });     //Sends the JSON data to the server
});

app.listen(PORT, () => {                                         //Used for displaying data on the backend
    console.log(`Server is running on http://localhost:${PORT}`);
});


//Connect to mongoDb
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI)
    .then(() => {
        console.log("🚀 MongoDB connection initiated successfully!");
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error during initialization:", err);
    });



// Monitor the active connection state
const db = mongoose.connection;
db.on('connected', () => {
    console.log('✅ Successfully connected to MongoDB Database!');
});
db.on('error', (err) => {
    console.error(`❌ MongoDB connection lost/error: ${err.message}`);
});
db.on('disconnected', () => {
    console.log('⚠️ MongoDB connection disconnected.');
});





// Scraping Endpoint
app.get('/api/scrape', async (req, res) => {
    try {
        const targetUrl = 'https://news.ycombinator.com/'; // Exam  
        
        // 1. Fetch the HTML of the page
        const { data } = await axios.get(targetUrl, {
            headers: {
                // Good practice: Set a User-Agent so you don't look like a basic bot
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        // 2. Load the HTML into Cheerio
        const $ = cheerio.load(data);
        const articles = [];

        // 3. Parse the data using CSS selectors
        // (On Hacker News, titles are inside spans with the class 'titleline')
        $('.titleline > a').each((index, element) => {
            const title = $(element).text();
            const link = $(element).attr('href');

            articles.push({
                title,
                link
            });
        });

        // 4. Return the structured JSON data to the client
        res.status(200).json({
            success: true,
            count: articles.length,
            data: articles
        });

    } catch (error) {
        console.error(`Scraping failed: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve or parse data.',
            error: error.message
        });
    }
});  

