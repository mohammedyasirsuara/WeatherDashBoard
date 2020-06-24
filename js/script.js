// open weather API key
const apiKey = "78bcb7c68e4408f4aee87df71053f5cf";

const cityName = document.querySelector("#userInput")
const searchBtn = document.querySelector("#searchBtn")
const cityList = document.querySelector("#citylist")
const currentLocation = document.querySelector("#currLocation")
const currentDate = document.querySelector("#currDate")
const currtemp = document.querySelector("#temp")
const currhumidity = document.querySelector("#humid")
const currWind = document.querySelector("#wSpeed")
const currUV = document.querySelector("#uvIndex")

//to store the city name, latitude and longitude
let weather = {
    lat: '',
    lon: '',
    city: ''
}

//convert the temperature value from Fahrenheit to Celcius
function convert(value) {
    var x = Math.floor((value - 32) * 5 / 9)
    return x;
}

//get the weather forecast for that day
const getCurrentWeather = (name) => {
    let url = 'https://api.openweathermap.org/data/2.5/weather?q=' + name + '&APPID=' + apiKey + '&units=imperial';
    fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            //console.log(data)
            currentLocation.textContent = data.name + ", " + data.sys.country
            currentDate.textContent = new Date(data.dt * 1000).toLocaleDateString("en-US")
            document.querySelector('#weather-icon').src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png"
            currhumidity.textContent = data.main.humidity
            currtemp.textContent = convert(data.main.temp)
            currWind.textContent = data.wind.speed
            weather.lat = data.coord.lat
            weather.lon = data.coord.lon
            weather.city = data.name
        }).then(() => {
            //gets the uv index value
            getIndex(weather.lat, weather.lon)
        }).then(() => {
            //gets the forecast for the next 5 days
            getforecast(weather.city)
        })//.catch((error)=>{
    //     alert("Invalid City!!")
    //     cityList.removeChild(cityList.children[0])
    // })
}

//function to get the uv index number based on latitude and longitude
const getIndex = (lati, longi) => {
    let url = 'https://api.openweathermap.org/data/2.5/uvi?appid=' + apiKey + '&lat=' + lati + '&lon=' + longi
    fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            currUV.textContent = ''

            let uvNum = data.value
            currUV.textContent = uvNum

            //check the uvNumber with the index and set the button colour accordingly
            if (uvNum >= 0 && uvNum <= 2) {
                currUV.textContent = uvNum
                currUV.classList.remove("bg-warning")
                currUV.classList.remove("bg-danger")
                currUV.classList.add("bg-success")
            } else if (uvNum >= 3 && uvNum <= 8) {
                currUV.textContent = uvNum
                currUV.classList.remove("bg-success")
                currUV.classList.remove("bg-danger")
                currUV.classList.add("bg-warning")
            } else {
                currUV.textContent = uvNum
                currUV.classList.remove("bg-warning")
                currUV.classList.remove("bg-success")
                currUV.classList.add("bg-danger")
            }
        })
}

//function to generate the forecast for the next 5 days
const getforecast = (city) => {
    let url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey + '&units=imperial'
    fetch(url)
        .then((response) => {
            return response.json();
        }).then((data) => {
            //console.log(data)
            let temp = document.querySelectorAll(".days") //select the cards for the 5 day forecast
            var weatherIndex = 0
            let day = 1
            for (var i = 0; i < temp.length; i++) {
                //increase the date by 1
                var date = moment().add(day, 'days').format("MM/DD/YYYY")
                //console.log(temp[i].children)

                //change the html text to the date
                temp[i].children[0].textContent = date

                //set the src attribute of the html element to the weather icon
                temp[i].children[1].src = "https://openweathermap.org/img/wn/" + data.list[weatherIndex].weather[0].icon + "@2x.png"

                //change the html element text to the humidity value
                temp[i].children[2].textContent = "Humidity: " + data.list[weatherIndex].main.humidity + "%"

                //change the html element text to the temperature value
                temp[i].children[3].textContent = 'Temp: ' + convert(data.list[weatherIndex].main.temp) + "°C"

                weatherIndex += 8 //increase the weather index by every 8 arrays (8 arrays per day)
                day++ //increase the day count
            }
        })
}

const renderSearch = (e) => {
    e.preventDefault()

    let stamps = document.querySelectorAll(".days")
    for (i = 0; i < stamps; i++) {
        stamps[i].innerHTML = ''
    }
    let name = ''
    if (cityName.value) {
        //convert the first digit of the number to uppercase and the rest to lowercase
        name = cityName.value[0].toUpperCase() + cityName.value.slice(1).toLowerCase();

        // console.log(name)
    } else {
        return
    }
    //store searched city to local storage
    localStorage.setItem('city', name)
    cityName.value = ''

    //store searched city to a list
    createList(name)

    //get the current weather of the searched city
    getCurrentWeather(name)
}

//function to add a city to the list group everytime a city is searched
const createList = (temp) => {
    let item = document.createElement('li')
    item.classList.add('list-group-item')
    item.textContent = temp
    item.addEventListener('click', function (e) {
        var item = e.target.textContent
        let stamps = document.querySelectorAll(".days")
        // for (i = 0; i < stamps; i++) {
        //     stamps[i].innerHTML = ''
        // }
        getCurrentWeather(item)
    })
    cityList.prepend(item)
}

searchBtn.addEventListener('click', renderSearch)

//get the last searched city when the page is reloaded
const lcity = localStorage.getItem('city')
if (lcity) {
    getCurrentWeather(lcity)
}

