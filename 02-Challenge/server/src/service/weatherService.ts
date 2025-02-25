import dotenv from 'dotenv'; //imports API Key 
//import { query } from 'express'; 
dotenv.config(); //configures API Key


// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number; 
  name: string;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(
    city: string,
    date: string,
    icon: string,
    iconDescription: string,
    tempF: number,
    windSpeed: number,
    humidity: number
  ) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}


// TODO: Complete the WeatherService class
class WeatherService {
  private baseURL: string;
  private apiKey: string; 
 
  // TODO: Define the baseURL, API key, and city name properties
  constructor() {
    this.baseURL = process.env.API_BASE_URL || 'https://api.openweathermap.org';
    this.apiKey = process.env.API_KEY || '';
    console.log('Weather Service initialized. API Key:', this.apiKey);
  }

  


  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}

  private async fetchLocationData(query: string): Promise<any> {
    const url = `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(query)}&appid=${this.apiKey}`;
    console.log('Fetching location data from:', url);
    const response = await fetch(url); 
    if (!response.ok) {
      throw new Error('Failed to fetch location data')
    }
    const data = await response.json();
    console.log('Geocode API response:', data)
    if (!data || data.length === 0) {
      throw new Error ('Location not found')
    }
    return data[0]; //use the first match in the array 
  }

 
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}

  private destructureLocationData(locationData: any): Coordinates {
    if (!locationData) {
      throw new Error('Received undefined location data')
    }
    const { lat, lon, name } = locationData;
    return { lat, lon, name };
  }

  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  private buildGeocodeQuery(query: string): string {
    return `${this.baseURL}/geo/1.0/direct?q=${encodeURIComponent(
      query
    )}&appid=${this.apiKey}`;
  };  // private so it can only be used in this class; 
      //looks at openweather api and uses /geo/1.0/direct - the service to convert location name to lat/long
      //uses the private API key 


  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }



  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);
    if (!response.ok){
      throw new Error('Failed to fetch weather data');
    }
    return await response.json();
  }


  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  private parseCurrentWeather(weatherResponse: any): Weather {
    const current = weatherResponse.list[0];
    return new Weather(
      weatherResponse.city.name,
      new Date(current.dt * 1000).toLocaleDateString(),
      current.weather[0].icon,
      current.weather[0].description,
      current.main.temp,
      current.wind.speed,
      current.main.humidity
    );
  }


  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    return weatherData.map((data) => new Weather(
      currentWeather.city,
      new Date(data.dt * 1000).toLocaleDateString(),
      data.weather[0].icon,
      data.weather[0].description,
      data.main.temp,
      data.wind.speed,
      data.main.humidity
    ));
  }



  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
  async getWeatherForCity(city: string): Promise<Weather[]> {
    const coordinates = await this.fetchAndDestructureLocationData(city);
    const weatherResponse = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherResponse);
    // Assume the forecast is the rest of the list items.
    const forecastData = weatherResponse.list.slice(1);
    const forecastArray = this.buildForecastArray(currentWeather, forecastData);
    return [currentWeather, ...forecastArray];
  }
}



export default new WeatherService();
