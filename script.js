
const API_KEY = "818f1ebb296d8553b9a8a11a19d1d35b";

// DOM elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const temperature = document.getElementById('temperature');
const tempMax = document.getElementById('temp-max');
const tempMin = document.getElementById('temp-min');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const windSpeed = document.getElementById('wind-speed');
const humidity = document.getElementById('humidity');
const uvIndex = document.getElementById('uv-index');
const forecastContainer = document.getElementById('forecast-container');
const yourName = document.getElementById('your-name');


yourName.textContent = "Mokhtar Lahjaily";

// Event listeners
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        searchWeather();
    }
});

// Default city on load
window.addEventListener('DOMContentLoaded', () => {
    getWeatherData('London');
});

// Search weather function
function searchWeather() {
    const city = cityInput.value.trim();
    if (city) {
        getWeatherData(city);
    } else {
        alert('Please enter a city name');
    }
}

// Get weather data from API
async function getWeatherData(city) {
    try {
        console.log(`Searching for city: ${city}`);
        
        // DIRECT WEATHER API CALL (more reliable than geocoding + onecall for free tier)
        const weatherResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        
        if (!weatherResponse.ok) {
            throw new Error(`Weather API error: ${weatherResponse.status} ${weatherResponse.statusText}`);
        }
        
        const weatherData = await weatherResponse.json();
        console.log("Current weather data:", weatherData);
        
        // Display current weather
        displayCurrentWeather(weatherData, weatherData.name);
        
        // Get forecast data
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
        );
        
        if (!forecastResponse.ok) {
            throw new Error(`Forecast API error: ${forecastResponse.status} ${forecastResponse.statusText}`);
        }
        
        const forecastData = await forecastResponse.json();
        console.log("Forecast data:", forecastData);
        
        // Display forecast
        displayForecast(forecastData);
        
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert(`Error: ${error.message || 'Failed to fetch weather data. Please check your API key and try again.'}`);
    }
}

// Display current weather using Weather API 2.5
function displayCurrentWeather(data, city) {
    const today = new Date();
    
    // Set city name and date
    cityName.textContent = city;
    currentDate.textContent = formatDate(today);
    
    // Set temperature and weather details
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    tempMax.textContent = `${Math.round(data.main.temp_max)}°C`;
    tempMin.textContent = `${Math.round(data.main.temp_min)}°C`;
    
    // Set weather icon and description
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;
    weatherDescription.textContent = capitalizeFirstLetter(data.weather[0].description);
    
    // Set additional weather details
    windSpeed.textContent = `${data.wind.speed} m/s`;
    humidity.textContent = `${data.main.humidity}%`;
    uvIndex.textContent = 'N/A'; // UV Index not available in basic API
    
    // Color temperature based on value
    setTempColor(temperature, data.main.temp);
}

// Display forecast using Forecast API 2.5
function displayForecast(forecastData) {
    forecastContainer.innerHTML = '';
    
    // Filter forecast data to get one forecast per day (at noon)
    const dailyForecasts = [];
    const processedDates = new Set();
    
    for (const item of forecastData.list) {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toDateString();
        
        // Skip if we already have a forecast for this date
        if (processedDates.has(dateStr)) continue;
        
        // Skip today's forecast (we already show current weather)
        if (date.toDateString() === new Date().toDateString()) continue;
        
        processedDates.add(dateStr);
        dailyForecasts.push(item);
        
        // Stop after getting 5 days
        if (dailyForecasts.length >= 5) break;
    }
    
    dailyForecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        
        const tempClass = getTempColorClass(forecast.main.temp);
        
        forecastCard.innerHTML = `
            <p class="forecast-date">${formatDate(date, true)}</p>
            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt="${forecast.weather[0].description}">
            <p class="forecast-temp ${tempClass}">${Math.round(forecast.main.temp)}°C</p>
            <p>${capitalizeFirstLetter(forecast.weather[0].description)}</p>
            <p><i class="fas fa-tint"></i> ${forecast.main.humidity}%</p>
        `;
        
        forecastContainer.appendChild(forecastCard);
    });
}

// Helper function to format date
function formatDate(date, short = false) {
    const options = short 
        ? { weekday: 'short', month: 'short', day: 'numeric' }
        : { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    
    return date.toLocaleDateString('en-US', options);
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Set temperature color based on value
function setTempColor(element, temp) {
    // Remove all existing color classes
    element.classList.remove('cold', 'cool', 'mild', 'warm', 'hot');
    
    // Add appropriate color class
    element.classList.add(getTempColorClass(temp));
}

// Get temperature color class
function getTempColorClass(temp) {
    if (temp < 5) return 'cold';
    if (temp < 15) return 'cool';
    if (temp < 25) return 'mild';
    if (temp < 32) return 'warm';
    return 'hot';
}