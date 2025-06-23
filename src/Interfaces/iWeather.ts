export  interface IWeatherData {
    // Add only the fields you need from the OpenWeather API response
    weather?: { 
        description: string; 
        icon: string,
        id: number
        main: string,

    }[];
    wind?: { 
        deg: number,
        gust: number; 
        speed: number; 
    };

    main?: { 
        feels_like: number;
        grnd_level: number;
        humidity: number;
        pressure: number;
        temp: number;
        temp_max: number;
        temp_min: number;
    };
    name?: string;
    sys?: { 
        country: string; 
        sunrise: number; 
        sunset: number 
    };

    // Add more fields as needed
  }
