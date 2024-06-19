// Function to fetch weather data
async function fetchWeatherData(locationCode) {
  const forecastUrl = `https://api.weather.gov/gridpoints/MEG/${locationCode}/forecast/hourly`;

  try {
      const response = await axios.get(forecastUrl, {
          headers: {
          }
      });
      return response.data;
  } catch (error) {
      console.error(`Error fetching weather data: ${error}`);
      return null;
  }
}

// Function to format and display weather information in HTML
async function displayWeatherInfo(locationCode) {
  try {
      const weatherData = await fetchWeatherData(locationCode);

      if (!weatherData || !weatherData.properties || !weatherData.properties.periods) {
          console.error('Invalid weather data format');
          return;
      }

      const periods = weatherData.properties.periods;

      // Find the current hour index
      const currentHourIndex = findCurrentHourIndex(periods);

      // Iterate through each period and update HR1 to HR5
      for (let i = 0; i < Math.min(periods.length, 5); i++) {
          const containerId = `weather-box-HR${i + 1}`;
          const weatherContainer = document.getElementById(containerId);

          if (weatherContainer) {
              weatherContainer.innerHTML = ''; // Clear previous content

              const period = periods[currentHourIndex + i];

              // Convert start and end times to 12-hour format
              const startTime = convertTo12Hour(period.startTime);
              const endTime = convertTo12Hour(period.endTime);

              // Convert wind speed from "5 mph" to "5 MPH"
              const windSpeed = period.windSpeed.toUpperCase();

              // Extract the icon URL from the API response
              const iconUrl = period.icon;

              const periodDiv = document.createElement('div');
              periodDiv.classList.add('weather-period');

              periodDiv.innerHTML = `
                  <h3>${startTime}</h3>
                  <img src="${iconUrl}" alt="${period.shortForecast}" class="weather-icon">
                  <p>Temperature: ${period.temperature} °F</p>
                  <p>Short Forecast: ${period.shortForecast}</p>
                  <p>Wind: ${windSpeed} from ${period.windDirection}</p>
                  <p>Humidity: ${period.relativeHumidity.value}%</p>
                  <p>Precipitation Probability: ${period.probabilityOfPrecipitation.value}%</p>
              `;

              weatherContainer.appendChild(periodDiv);
          } else {
              console.error(`Weather container ${containerId} not found.`);
          }
      }

  } catch (error) {
      console.error(`Error displaying weather info: ${error}`);
  }
}

// Helper function to find the index of the current hour's data
function findCurrentHourIndex(periods) {
  const currentDateTime = new Date();

  for (let i = 0; i < periods.length; i++) {
      const startTime = new Date(periods[i].startTime);
      const endTime = new Date(periods[i].endTime);

      if (currentDateTime >= startTime && currentDateTime < endTime) {
          return i;
      }
  }

  // Default to the first hour if current hour not found
  return 0;
}

// Helper function to convert time to 12-hour format
function convertTo12Hour(timeString) {
  const time = new Date(timeString);
  return time.toLocaleString('en-US', {
      hour: 'numeric',
      hour12: true
  }).replace(':00', ''); 
}

const locationCode = '75,125'; // Replace with your location code
displayWeatherInfo(locationCode);
