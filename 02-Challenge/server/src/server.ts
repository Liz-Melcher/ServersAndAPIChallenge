import dotenv from 'dotenv';
import express from 'express';
import path from 'path'; //Liz added this 2/21/2025 
import { fileURLToPath } from 'url'; // Liz added this
dotenv.config();

// Import the routes
import routes from './routes/index.js';

const app = express();

const PORT = process.env.PORT || 3001;

// TODO: Serve static files of entire client dist folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, '../client/dist')));


// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json())
app.use(express.urlencoded({ extended: true}));

// TODO: Implement middleware to connect the routes
app.use(routes);

// Start the server on the ports
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));
