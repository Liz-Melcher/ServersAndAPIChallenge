import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 3001;


//console.log('Loaded API Key:', process.env.API_KEY);

// Import the routes
import routes from './routes/index';
import weatherRoutes from './routes/api/weatherRoutes';

// TODO: Serve static files of entire client dist folder



app.use(express.static(path.join(__dirname, '../client/dist')));


// TODO: Implement middleware for parsing JSON and urlencoded form data
app.use(express.json())
app.use(express.urlencoded({ extended: true}));

// TODO: Implement middleware to connect the routes
app.use('/api/weather', weatherRoutes)
app.use(routes);

// Start the server on the ports
app.listen(PORT, '0.0.0.0',() => console.log(`Listening on PORT: ${PORT}`));
