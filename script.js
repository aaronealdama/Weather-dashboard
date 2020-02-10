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

// Global Variables
let emptyArr = []; // used to hold filtered response data
let uvIndexValue = 0;
let divCurrentTemp, divCurrentHumidity, divCurrentWindSpeed, newCurrentImage;
// declared variables that will change value later in the script

//Functions
function elementGenerator(element, classTitle, idTitle, text) {
  let newElement = $("<" + element + ">");
  newElement.attr("class", classTitle);
  newElement.attr("id", idTitle);
  newElement.text(text);
  return newElement;
} // function that generates elements and sets their attributes

function filteredData() {
  let cityName = $("#search-bar").val();
  let queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    cityName +
    "&APPID=84df449c8c088263e2e354a1926ed25a&units=imperial";
  let currentDataQueryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&APPID=626f2185f392c0cd5f0bd597446c71df&units=imperial";

  if (emptyArr.length !== 0) {
    emptyArr = [];
  }

  $.ajax({
    url: currentDataQueryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    divCurrentTemp = elementGenerator(
      "div",
      "current-day-div",
      "current-temperature",
      "Temp: " + response.main.temp + " Fahrenheit"
    );
    divCurrentHumidity = elementGenerator(
      "div",
      "current-day-div",
      "current-humidity",
      "Humidity: " + response.main.humidity + " %"
    );
    divCurrentWindSpeed = elementGenerator(
      "div",
      "current-day-div",
      "current-wind-speed",
      "Wind Speed: " + response.wind.speed + " miles/hour"
    );
    newCurrentImage = elementGenerator("img", "weather-icon");
    newCurrentImage.attr(
      "src",
      "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
    );
    let uvQuery =
      "https://api.openweathermap.org/data/2.5/uvi?appid=626f2185f392c0cd5f0bd597446c71df&lat=" +
      response.coord.lat +
      "&lon=" +
      response.coord.lon;
    uvIndex(uvQuery); // calls a seperate function with parameter uvQuery to get the UV index data
  }); // function that filters data as well as makes another API call to get the current data

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    for (let i = 0; i < response.list.length; i++) {
      if (response.list[i].dt_txt.includes("12:00:00")) {
        emptyArr.push(response.list[i]);
      }
    }
    console.log(emptyArr);
    fiveDayForcast();
  });
} // function that filters out the data from the API and calls another function fiveDayForcast after

function uvIndex(uvData) {
  $.ajax({
    url: uvData,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    uvIndexValue = response.value;
    fiveDayForcast();
  });
} // function that changes the value of the UV index by
// using another API call with uvData being the url

function fiveDayForcast() {
  $(".card-deck").empty();
  $(".current-weather").empty();

  let currentDayDiv = elementGenerator("div", "current-day");
  let divCurrentUV = elementGenerator(
    "div",
    "current-day-div",
    "current-uv",
    "UV Index: " + uvIndexValue
  );
  let dateToday = moment().format("MM/DD/YYYY");
  let dateHeading = elementGenerator("h1", "heading");
  dateHeading.text(dateToday);

  for (let i = 0; i < emptyArr.length; i++) {
    let fiveDayDiv = elementGenerator("div", "five-day card");
    let cardBody = elementGenerator("div", "card-body");
    let divDate = elementGenerator(
      "div",
      "five-day-div",
      "date",
      "Date: " + emptyArr[i].dt_txt + ""
    );
    let divTemp = elementGenerator(
      "div",
      "five-day-div",
      "temp",
      "Temp: " + emptyArr[i].main.temp + " Fahrenheit"
    );
    let divHumidity = elementGenerator(
      "div",
      "five-day-div",
      "humidity",
      "Humidity: " + emptyArr[i].main.humidity + " %"
    );
    let newImage = elementGenerator("img", "weather-icon");
    newImage.attr(
      "src",
      "http://openweathermap.org/img/w/" + emptyArr[i].weather[0].icon + ".png"
    );
    cardBody.append(divDate, divTemp, divHumidity, newImage);
    fiveDayDiv.append(cardBody);
    $(".card-deck").append(fiveDayDiv);
  }

  currentDayDiv.append(
    dateHeading,
    divCurrentTemp,
    divCurrentHumidity,
    divCurrentWindSpeed,
    divCurrentUV,
    newCurrentImage
  );
  $(".current-weather").append(currentDayDiv);
  return this;
} // function that gets and appends the weather data for the next five days

//Event Listeners
$("form").on("submit", function(e) {
  e.preventDefault();
  let newButton = elementGenerator(
    "button",
    "search-button btn btn-dark",
    $("#search-bar").val(),
    $("#search-bar").val()
  );
  let listItem = elementGenerator("li", "list-item", $("#search-bar").val());
  listItem.append(newButton);
  $(".searches-container").append(listItem);
  filteredData();
});

$(".search").on("click", function(e) {
  e.preventDefault();
  let newButton = elementGenerator(
    "button",
    "search-button btn btn-dark",
    $("#search-bar").val(),
    $("#search-bar").val()
  );
  let listItem = elementGenerator("li", "list-item", $("#search-bar").val());
  listItem.append(newButton);
  $(".searches-container").append(listItem);
  filteredData();
});

$(document).on("click", ".search-button", function() {
  let buttonName = $(this).attr("id");
  let queryURL =
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
    buttonName +
    "&APPID=84df449c8c088263e2e354a1926ed25a&units=imperial";
  let currentDataQueryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    buttonName +
    "&APPID=626f2185f392c0cd5f0bd597446c71df&units=imperial";

  if (emptyArr.length !== 0) {
    emptyArr = [];
  }

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    for (let i = 0; i < response.list.length; i++) {
      if (response.list[i].dt_txt.includes("12:00:00")) {
        emptyArr.push(response.list[i]);
      }
    }
    fiveDayForcast();
  });

  $.ajax({
    url: currentDataQueryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    divCurrentTemp = elementGenerator(
      "div",
      "current-day-div",
      "current-temperature",
      "Temp: " + response.main.temp + " Fahrenheit"
    );
    divCurrentHumidity = elementGenerator(
      "div",
      "current-day-div",
      "current-humidity",
      "Humidity: " + response.main.humidity + " %"
    );
    divCurrentWindSpeed = elementGenerator(
      "div",
      "current-day-div",
      "current-wind-speed",
      "Wind Speed: " + response.wind.speed + " miles/hour"
    );
    newCurrentImage = elementGenerator("img", "weather-icon");
    newCurrentImage.attr(
      "src",
      "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
    );
    let uvQuery =
      "https://api.openweathermap.org/data/2.5/uvi?appid=626f2185f392c0cd5f0bd597446c71df&lat=" +
      response.coord.lat +
      "&lon=" +
      response.coord.lon;
    uvIndex(uvQuery);
    fiveDayForcast();
  });
});
