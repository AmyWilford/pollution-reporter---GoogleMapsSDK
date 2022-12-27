// variable to hold API key value
let key = config.MY_KEY;

// Create script tag & link google api url with config key
let script = document.createElement("script");
script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`;

// Establish global variables
let map;
let markers = [];
let marker;
let geocoder;
let responseDiv;
let response;
let pollutionLat;
let pollutionLng;

// Function to initiate map - center point begins
function initMap() {
  coordinates = { lat: 43.6532, lng: -79.3832 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: coordinates,
    zoom: 7,
    disableDefaultUI: true,
  });
  // establish google maps Geocoder
  geocoder = new google.maps.Geocoder();

  // Create geocoder search input and set attributes
  const inputText = document.createElement("input");
  inputText.type = "text";
  inputText.placeholder = "Search your location";

  // Create geocoder search button and set attributes
  const submitButton = document.createElement("input");
  submitButton.type = "button";
  submitButton.value = "Geocode";
  submitButton.classList.add("btn", "btn-success");
  // Create geocoder clear button
  // const clearButton = document.createElement("input");

  // clearButton.type = "button";
  // clearButton.value = "Clear";
  // clearButton.classList.add("button", "button-secondary");
  // response = document.createElement("pre");
  // response.id = "response";
  // response.innerText = "";
  // responseDiv = document.createElement("div");
  // responseDiv.id = "response-container";
  // responseDiv.appendChild(response);

  map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputText);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(submitButton);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(clearButton);
  // map.controls[google.maps.ControlPosition.LEFT_TOP].push(instructionsElement);
  // map.controls[google.maps.ControlPosition.LEFT_TOP].push(responseDiv);
  marker = new google.maps.Marker({
    map,
  });
  map.addListener("click", (e) => {
    geocode({ location: e.latLng });
  });
  submitButton.addEventListener("click", () =>
    geocode({ address: inputText.value })
  );
  // clearButton.addEventListener("click", () => {
  //   clear();
  // });
  // clear();

  // Event listener to show lat and lng of area on click
  map.addListener("click", (e) => {
    placeMarkerAndPanTo(e.latLng, map);
  });

  // Info window will show coordaintes
  let infoWindow = new google.maps.InfoWindow({
    content: "Zoom in to pin the pollution location",
    position: coordinates,
  });

  infoWindow.open(map);
  // Configure the click listener.
  map.addListener("click", (mapsMouseEvent) => {
    // Close the current InfoWindow.
    infoWindow.close();
    // Create a new InfoWindow.
    infoWindow = new google.maps.InfoWindow({
      position: mapsMouseEvent.latLng,
    });
    infoWindow.setContent(
      JSON.stringify(
        mapsMouseEvent.latLng.toJSON().lat +
          " & " +
          mapsMouseEvent.latLng.toJSON().lng
      )
    );
    pollutionLat = JSON.stringify(mapsMouseEvent.latLng.toJSON().lat);
    pollutionLng = JSON.stringify(mapsMouseEvent.latLng.toJSON().lng);
    infoWindow.open(map);
  });
}
function clear() {
  marker.setMap(null);
}

// Function to reset map per geolocation search
function geocode(request) {
  clear();
  geocoder
    .geocode(request)
    .then((result) => {
      const { results } = result;

      map.setCenter(results[0].geometry.location);
      marker.setPosition(results[0].geometry.location);
      marker.setMap(map);
      return results;
    })
    .catch((e) => {
      alert("Geocode was not successful for the following reason: " + e);
    });
}

function placeMarkerAndPanTo(latLng, map) {
  new google.maps.Marker({
    position: latLng,
    map: map,
  });
  map.panTo(latLng);
}

// Function to pull information from submit form and submit a pollution report
function submitPollutionReport(event) {
  event.preventDefault();
  let inputLat = document.getElementById("lat").value;
  let inputLng = document.getElementById("lng").value;
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let pollutionConcern = document.getElementById("pollutionConcern").value;

  // If lat and lng inputs are filled in use entered data - otherwise will be set to pinned location
  if (inputLat || inputLng) {
    pollutionLat = inputLat;
    pollutionLng = inputLng;
  }
  // Set report in an object
  let report = {
    pollutionLat,
    pollutionLng,
    name,
    email,
    pollutionConcern,
  };
  console.log(report);
}

// On submit report button click, run submitPollutionReport function
let submitReport = document.getElementById("submit-report");
submitReport.addEventListener("click", submitPollutionReport);

window.initMap = initMap;
// Add generated script tag to file
document.head.appendChild(script);
