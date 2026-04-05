const weatherForm = document.querySelector('.weatherform');
const cityInput = document.querySelector('.cityinput');
const card = document.querySelector('.card');

const apiKey = '056f95d8d8aacc6ca1b8874a1bb99df3';

weatherForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (!city) {
    return displayError('Please enter a city name.');
  }

  try {
    const weatherData = await getWeatherData(city);
    displayWeatherInfo(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    const message = error.message.includes('404')
      ? 'City not found. Try another name.'
      : 'An error occurred while fetching weather data. Please try again later.';
    displayError(message);
  }
});

async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  return response.json();
}

function displayWeatherInfo(data) {
  const {
    name: city,
    main: { temp, humidity },
    weather,
    wind: { speed },
  } = data;
  const [{ description, id }] = weather;

  card.innerHTML = '';
  card.style.display = 'block';

  const cityDisplay = document.createElement('h1');
  cityDisplay.textContent = city;
  cityDisplay.classList.add('citydisplay');

  const tempDisplay = document.createElement('p');
  tempDisplay.textContent = `Temperature: ${temp.toFixed(1)}°C`;
  tempDisplay.classList.add('tempdisplay');

  const humidityDisplay = document.createElement('p');
  humidityDisplay.textContent = `Humidity: ${humidity}%`;
  humidityDisplay.classList.add('humiditydisplay');

  const descDisplay = document.createElement('p');
  descDisplay.textContent = `Description: ${description}`;
  descDisplay.classList.add('descDisplay');

  const windDisplay = document.createElement('p');
  windDisplay.textContent = `Wind Speed: ${speed} m/s`;
  windDisplay.classList.add('winddisplay');

  const weatherEmoji = document.createElement('p');
  weatherEmoji.textContent = getWeatherEmoji(id);
  weatherEmoji.classList.add('weatheremoji');

  card.append(
    cityDisplay,
    tempDisplay,
    humidityDisplay,
    descDisplay,
    windDisplay,
    weatherEmoji
  );
}

function getWeatherEmoji(weatherId) {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return '⛈️';
    case weatherId >= 300 && weatherId < 400:
      return '🌦️';
    case weatherId >= 500 && weatherId < 600:
      return '🌧️';
    case weatherId >= 600 && weatherId < 700:
      return '❄️';
    case weatherId >= 700 && weatherId < 800:
      return '🌫️';
    case weatherId === 800:
      return '☀️';
    case weatherId > 800 && weatherId < 900:
      return '☁️';
    default:
      return '❓';
  }
}

function displayError(message) {
  card.innerHTML = '';
  card.style.display = 'block';

  const errorDisplay = document.createElement('p');
  errorDisplay.textContent = message;
  errorDisplay.classList.add('errorDisplay');

  card.appendChild(errorDisplay);
}

