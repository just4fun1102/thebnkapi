const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('./config/db');
const userRoutes = require('./routes/userRoute'); // Import user routes
require("dotenv").config();
const cors = require('cors');

const app = express(); // Initialize the app object

// Use CORS middleware
app.use(cors());

const PORT = process.env.PORT || 3000;

// Connect to the MongoDB database
connectToDatabase();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use the user routes
app.use('/user', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
