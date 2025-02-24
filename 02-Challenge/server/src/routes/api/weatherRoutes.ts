import { Router, type Request, type Response } from 'express';
import historyService from '../../service/historyService';
import weatherService from '../../service/weatherService';

const router = Router();

// import HistoryService from '../../service/historyService.js';
// import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const {city} = req.body;
    if (!city) {
      return res.status(400).json({error: 'City is required'});
    }
    const weatherData = await weatherService.getWeatherForCity(city);
    await historyService.addCity(city);
    return res.status(200).json(weatherData);
  } catch (error: any) {
    console.error(error);
    return res
    .status(500)
    .json({error: error.message || 'Internal Server Error'});
  }



  // TODO: GET weather data from city name
  // TODO: save city to search history
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await historyService.getCities();
    return res.status(200).json(history);
  } catch (error: any) {
    console.error(error);
    return res
    .status(500)
    .json({ error: error.message || 'Internal Server Error'})
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateHistory = await historyService.removeCity(id);
    return res.status(200).json(updateHistory);
  } catch (error: any) {
    console.error(error); 
    return res
    .status(500)
    .json({ error: error.message || 'Internal Server Error'});
  }
  }
);

export default router;
