const APIKey = "65667bda3b254fa483e145229250809";
const weatherInfo = document.getElementById("weather-info");
const error = document.getElementById("error");
const loading = document.getElementById("loading");
const cityInput = document.getElementById("city-input");

async function getWeatherByCity(cityName) {
  showLoading();

  try {
    const weatherUrl = `https://api.weatherapi.com/v1/forecast.json?key=${APIKey}&q=${cityName}&days=7`;
    const response = await fetch(weatherUrl);
    const data = await response.json();
    if (response.status !== 200 || data.error) {
      throw new Error(data.error?.message || "City not found");
    }
    displayWeather(data);
  } catch (err) {
    showError(err);
  }
}

function getWeather() {
  if (!cityInput.value) return;
  getWeatherByCity(cityInput.value);
}

function displayWeather(data) {
  weatherInfo.classList.remove("d-none");
  error.classList.add("d-none");
  loading.classList.add("d-none");

  document.getElementById("city-name").innerHTML = `<i class="fa-solid fa-location-dot fa-bounce"></i>${data.location.name}`;
  document.getElementById("date").textContent = new Date(
    data.location.localtime
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  document.getElementById("temp").textContent = `${data.current.temp_c}°C`;
  document.getElementById("weather-description").textContent =
    data.current.condition.text;
  document.getElementById("weather-icon").src =
    "https:" + data.current.condition.icon;
  document.getElementById(
    "feels-like"
  ).innerHTML = `<i class="fa-solid fa-face-smile fa-fade fa-lg" style="color: #FFD43B;"></i>${data.current.feelslike_c}°C`;
  document.getElementById(
    "humidity"
  ).innerHTML = `<i class="fa-solid fa-droplet fa-fade fa-lg" style="color: #74C0FC;"></i>${data.current.humidity}%`;
  document.getElementById(
    "wind-speed"
  ).innerHTML = `<i class="fa-solid fa-wind fa-lg fa-fade"></i>${data.current.wind_kph}Kph`;
  document.getElementById(
    "uv-index"
  ).innerHTML = `<i class="fa-solid fa-sun fa-fade fa-lg" style="color: #FFD43B;"></i>${data.current.uv}`;
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";
  data.forecast.forecastday.forEach((day) => {
    const forecastDay = document.createElement("div");
    forecastDay.className = "forecast-day";

    forecastDay.innerHTML = `
        <h3>${new Date(day.date).toLocaleDateString("en-US", {
          weekday: "long",
        })}</h3>
        <img class="forecast-icon" src="https:${
          day.day.condition.icon
        }" alt="weather-icon">
        <p>${Math.round(day.day.maxtemp_c)}°C / ${Math.round(
      day.day.mintemp_c
    )}°C</p>
        <p>${day.day.condition.text}</p>
      `;
    forecastContainer.appendChild(forecastDay);
  });
}

function showError() {
  error.classList.remove("d-none");
  error.textContent = 'City is not found';
  error.style.animation = "none";
  error.offsetHeight;
  error.style.animation = null;
  weatherInfo.classList.add("d-none");
  loading.classList.add("d-none");
}

function showLoading() {
  loading.classList.remove("d-none");
  error.classList.add("d-none");
  weatherInfo.classList.add("d-none");
}
document.getElementById("city-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    getWeather();
  }
});
cityInput.addEventListener("input", () => {
  const defaultCity = "Cairo";
  getWeatherByCity(cityInput.value || defaultCity);
});

window.addEventListener("load", () => {
  const defaultCity = "Cairo";
  getWeatherByCity(cityInput.value || defaultCity);
});
