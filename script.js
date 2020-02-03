/* Backend Psuedo Code
What we need:
-Way to get weather information
-Way to store city history information
-Way to make the dynamically generate button clickable
-Generate 5 divs that weather info for that particular day

City Weather info:
City Name
Date
Temperature,
Humidity,
Wind Speed,
UV Index

Possible APIs:
Open Weather API
*/

$(".btn").on("click", function() {
  let cityName = $("#city-name").val();
  let queryURL =
    "http://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&APPID=84df449c8c088263e2e354a1926ed25a&units=imperial";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
  });
});
