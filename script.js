


let favouriteList = "";
let favoriteCount = 1;
let favoriteCondition = false;
let currentLocation =" "; 
let weatherInfo = document.querySelector(".weather-details");
let favouriteListElements = document.querySelector(".favorite-list");
let searchBarInputElement = document.querySelector(".search-bar");
let deleteButtons = "";
let forecast = "";
let forecastCondition = true;
function getInitialForecastUrl(city){
	const url = new URL("https://api.weatherapi.com/v1/current.json");
	url.searchParams.append("key", "7cf456bb49b0445f956112335230704");
	url.searchParams.append("q", city);
	return url;
}

let	weather = {
   
   apiKey: "7cf456bb49b0445f956112335230704",
   
   //WEATHER API DATA REQUEST
   fetchWeatherDetails: function(city) {
      
	   fetch( getInitialForecastUrl(city)).then((response) => response.json())
       .then((data) => this.displayWeather(data));
   },
   
   displayWeather: function(data) {
       const {name} = data.location;
       const {icon, text} = data.current.condition;
       const { temp_c, wind_kph, humidity} = data.current;
       document.querySelector('.city').innerText = `Whether in ${name}`;
       document.querySelector('.temperature').innerText = `${temp_c}°C`;
       document.querySelector('.icon').src = `https:${icon}`;
       document.querySelector('.description').innerText = text;
       document.querySelector('.humidity').innerText = `Humidity: ${humidity}%`;
       document.querySelector('.wind-speed').innerText = `Wind speed: ${wind_kph} km/h`;
       document.querySelector('.app').classList.remove('loading');
       
       currentLocation = name; 
       
       
   },
   
   search: function () {
	
			this.fetchWeatherDetails(document.querySelector(".search-input").value);
   },
   
   //INITIAL LOCATION GET FUNCTION
   initial : {
           //GEO-LOCATION API DATA REQUEST
           geoLocation: function() {
               fetch("http://ip-api.com/json")
               .then((response) => response.json())
               .then((data) => this.sendCity(data));
           },
           
           sendCity: function(data) {
            const {city} = data;
			currentLocation = city;
			weather.fetchWeatherDetails(city);
			forecast.search(city);
            document.querySelector('.forecast').innerHTML = "";
           }
   
       }

	}

weather.initial.geoLocation();

// FAVORITE LIST AND LOCAL STORAGE SECTION
function initFavouriteList(){
	
	favouriteList = JSON.parse(localStorage.getItem('data'));
	if(favouriteList == null){
		localStorage.setItem('data', '[ ]');
		favouriteList = [];
		retrun;
	}
	favouriteList.forEach((item)=>{
		favouriteListElements.querySelector(".list").innerHTML +=`<li class="favorite-city added" id="${item}"><button class="fav-btn ">${item}</button><button class="delete-favourite"> - </button></li>`;
	})

}

function initWeatherFromFavoriteList(){
	favoriteButtons = favouriteListElements.querySelectorAll(".fav-btn");
	favoriteButtons.forEach(button =>{
		button.addEventListener("click", (event) => { 
			const id = event.target.parentElement.id;
			weather.fetchWeatherDetails(id);
			
			currentLocation = id;
			forecastCondition = false;
			initForecast();
			forecast.search();
			});
	});
}

function initDeleteButtons(){
	deleteButtons = favouriteListElements.querySelectorAll(".delete-favourite");
	deleteButtons.forEach(button =>{
		button.addEventListener("click", (event) => { 
			const id = event.target.parentElement.id;
			deleteFromStoarage(id);
			event.target.parentElement.remove();
			});
	});
}



function saveLocal(){
	if(favouriteList.length >= 5)
	{
		alert('Favorite list is full.');
		return;
	}
	if(favouriteList.includes(currentLocation)){
		 alert('The location is already on the Favorite list.');
		 return;
	}
    favouriteList.push(currentLocation);
    localStorage.setItem('data', JSON.stringify(favouriteList));
	favouriteListElements.querySelector(".list").innerHTML +=`<li class="favorite-city added" id="${currentLocation}"><button class="fav-btn">${currentLocation}</button><button class="delete-favourite">-</button></li>`;
	initDeleteButtons();
	initWeatherFromFavoriteList();
	
}

function deleteFromStoarage(id){
	if(!favouriteList.includes(id))
	{
		alert("pune tu un text ca locatia nu exista");
		return;
	}
	const index = favouriteList.indexOf(id);
	favouriteList.splice(index, 1);
	localStorage.setItem('data', JSON.stringify(favouriteList));
}  

function initForecast(newCity){
	const url = new URL("https://api.weatherapi.com/v1/forecast.json");
	url.searchParams.append("key", "7cf456bb49b0445f956112335230704");
	url.searchParams.append("q", newCity != null ? newCity : currentLocation);
	url.searchParams.append("days", 7);
	
	forecast = {
		 
       forecastFetch: function(city) {
           fetch(url).then((response) => response.json())
           .then((data) => this.displayForecast(data));
       },
       displayForecast:  function(data) {
           for(let i = 0; i <= 6; i++) {
               let {icon, text} = data.forecast.forecastday[i].day.condition;
               let { avgtemp_c} =  data.forecast.forecastday[i].day;
               let {date} = data.forecast.forecastday[i];
               document.querySelector('.forecast').innerHTML += 
               `<div class="day col-md">
				<h4 class="date">${date}</h4>
               <h4 class="avgtemp">${avgtemp_c}°C</h4>
               <img src="https:${icon}"/>
               <div class="forecast-text">${text}<div>
               </div>`;
           }
           
       },
       
       search: function () {
		  document.querySelector('.forecast').innerHTML = " ";
		  this.forecastFetch(document.querySelector(".search-input").value);
		  
       }

	}
}    
// END FAVORITE LIST AND LOCAL STORAGE SECTION

searchBarInputElement.querySelector(".search-button").addEventListener("click", function() {
    weather.search(); 
    document.querySelector('.forecast').innerHTML = "";
	
});

searchBarInputElement.querySelector('.search-input').addEventListener("keyup", function(event) {
    if(event.key == "Enter") {
        weather.search();
        document.querySelector('.forecast').innerHTML = "";
		
    }
});

weatherInfo.querySelector('.favorite-button').addEventListener("click", () => {	
	 saveLocal();
});






initFavouriteList();    
initDeleteButtons();
initWeatherFromFavoriteList();



document.querySelector(".forecast-button").addEventListener("click", function() {
		initForecast();
    if(forecastCondition) {
       forecast.search();
       forecastCondition = false;
   } else {
       document.querySelector('.forecast').innerHTML = " ";
        forecastCondition = true;
  }
   
});
