import { promises as fs} from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HISTORY_FILE_PATH = path.join(__dirname, '../searchHistory.json');

// TODO: Define a City class with name and id properties

class City {
  id: string; 
  name: string; 

  constructor(name: string, id?: string) {
    this.name = name; 
    this.id = id || Date.now().toString();
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  // private async read() {}
  private async read(): Promise<City[]>{
    try {
      const data = await fs.readFile(HISTORY_FILE_PATH, 'utf-8');
      return JSON.parse(data) as City[]
    }
    catch (error: any) {
      if (error.code === 'ENOENT') {
        return[];
      }
      throw error;
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  // private async write(cities: City[]) {}

  private async write(cities: City[]): Promise<void> {
    await fs.writeFile(HISTORY_FILE_PATH, JSON.stringify(cities, null, 2), 'utf-8');
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  // async getCities() {}

  async getCities(): Promise<City[]> {
    return await this.read()
  }


  // TODO Define an addCity method that adds a city to the searchHistory.json file
  // async addCity(city: string) {}

  async addCity(city: string): Promise<City[]> {
    const cities = await this.read();
    const cityExists = cities.some((c) =>c.name.toLowerCase() === city.toLowerCase())
    if (!cityExists) {
      const newCity = new City(city); 
      cities.push(newCity);
      await this.write(cities)
    }

    return cities; 
  

  }


  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  // async removeCity(id: string) {}

  async removeCity(id: string): Promise<City[]>{
    const cities = await this.read();
    const updatedCities = cities.filter((c) => c.id !== id); 
    await this.write(updatedCities);
    return updatedCities
  }
}

export default new HistoryService();
