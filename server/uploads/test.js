(async function () {
  const location = { lat: undefined, lon: undefined };

  await navigator.geolocation.getCurrentPosition(
    (pos) => {
      const crd = pos.coords;

      location.lat = crd.latitude;
      location.lon = crd.longitude;
    },
    (error) => console.log(error),
    options
  );

  await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&appid=6ed60e37a7b0567bf0854dcb978a3d21`
  )
    .then((response) => response.json())
    .then((response) => setWeather(response.weather[0]))
    .catch((error) => console.log(error));
})();
