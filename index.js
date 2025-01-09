const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const usercontainer = document.querySelector(".weather-container");
const userInfoContainer = document.querySelector(".user-info-container");
const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");

const errorContainer = document.querySelector(".showerror");


//intially required
let currentTab = userTab;
const API_KEY = "ebadf44bffd4386e6325c3b2f0f7fc54";  
currentTab.classList.add("current-tab");                                    //?why we are not using . here 
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");
    }

    if(!searchForm.classList.contains("active")){
        userInfoContainer.classList.remove("active");
        grantAccessContainer.classList.remove("active");
        searchForm.classList.add("active");
    }
    else{
        // search tab pr hi hai aur hamne 'your weather' pr click kiya, toh hame search wale ko hata dena hai 
        // aur your weather wale ko bula dena hai pr usse pehle hamare pass your weather ki details hona chaiye 
        searchForm.classList.remove("active");
        userInfoContainer.classList.remove("active");
        getfromSessionStorage();

    }

}


function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");    //? how 
    if(!localCoordinates){
        //hame cooridinates hi nahi mile aapne access hi nahi diya toh grant access wala page khol do
        grantAccessContainer.classList.add("active");
    }
    else{
        // mtlb coordinates mil gaye hai aap your weather wala section dikha do with API call
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }  
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates;
    grantAccessContainer.classList.remove("active");
    errorContainer.classList.remove("active");
    //make loader visible
    loadingScreen.classList.add("active");

    //api call 
    try{
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();

      loadingScreen.classList.remove("active");
      userInfoContainer.classList.add("active");

      renderWeatherInfo(data);
    }
    catch(err){
        loadingScreen.classList.remove("active");

        console.log("Error Found", err);
    }
}

function renderWeatherInfo(weatherInfo){
    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const cloudiness = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;

    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;

    desc.innerText = weatherInfo?.weather?.[0]?.description;

    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

    temp.innerText = `${weatherInfo?.main?.temp} °C`;

    windspeed.innerText = `${weatherInfo?.wind?.speed} m/s`;

    humidity.innerText = `${weatherInfo?.main?.humidity}%`;

    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;

}

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        alert("No access of Location , Allow Location ");
    }
}

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }

    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click",getLocation);




const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "")
        return;
    else 
        fetchSearchWeatherInfo(cityName);
})

async function fetchSearchWeatherInfo(city) {

    // error container 
    errorContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
          );
        const data = await response.json();
        if (!data.sys) {
            throw data;
          }
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err) {
        console.log("error found ", err);
        
        //yaha likhna pada
        loadingScreen.classList.remove("active");
        errorContainer.classList.add("active");
        
    }
}



userTab.addEventListener("click", ()=>{
    switchTab(userTab);
});

searchTab.addEventListener("click", ()=>{
    switchTab(searchTab);
});