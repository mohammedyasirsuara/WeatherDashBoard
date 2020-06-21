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

let weather = {
    lat: '',
    lon: '',
    city: ''
}

function convert(value) {
    var x = Math.floor((value - 32) * 5 / 9)
    return x;
}

const getCurrentWeather = (name) => {

    let url = 'http://api.openweathermap.org/data/2.5/weather?q=' + name + '&APPID=' + apiKey + '&units=imperial';
    fetch(url)
        .then((response) => {
            return response.json()
        })
        .then((data) => {
            console.log(data)

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
            getIndex(weather.lat, weather.lon)
        }).then(() => {
            getforecast(weather.city)
        })//.catch((error)=>{
        //     alert("Invalid City!!")
        //     cityList.removeChild(cityList.children[0])
        // })
}

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

const getforecast = (city) => {
    let url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&appid=' + apiKey + '&units=imperial'
    fetch(url)
        .then((response) => {
            return response.json();
        }).then((data) => {

            let stamps = document.querySelectorAll(".days")
            for (i = 0; i < stamps; i++) {
                stamps[i].innerHTML = ''
            }
            console.log(data)
            let temp = document.querySelectorAll(".days")
            var weatherIndex = 0
            let day = 1
            for (var i = 0; i < temp.length; i++) {
                //var dat = new Date(data.list[weatherIndex].dt * 1000).toLocaleDateString("en-US")
                var date = moment().add(day, 'days').format("MM/DD/YYYY")
                //console.log(temp[i].children)

                // var p = document.createElement("p")
                // p.textContent = date
                // temp[i].appendChild(p)
                temp[i].children[0].textContent = date

                // var img = document.createElement("img")
                // img.setAttribute('src', "https://openweathermap.org/img/wn/" + data.list[weatherIndex].weather[0].icon + "@2x.png")
                // img.style.width = "70px"
                // temp[i].appendChild(img)
                temp[i].children[1].src = "https://openweathermap.org/img/wn/" + data.list[weatherIndex].weather[0].icon + "@2x.png"

                // var p2 = document.createElement("p")
                // p2.textContent = "Humidity: " + data.list[weatherIndex].main.humidity + "%"
                // temp[i].appendChild(p2)
                temp[i].children[2].textContent = "Humidity: " + data.list[weatherIndex].main.humidity + "%"

                // var p3 = document.createElement("p")
                // p3.innerHTML = 'Temp: ' + convert(data.list[weatherIndex].main.temp) + '&#8451;'
                // temp[i].appendChild(p3)
                // console.log(data.list[weatherIndex].main.temp)
                temp[i].children[3].textContent = 'Temp: ' + convert(data.list[weatherIndex].main.temp) + "°C"
    
                weatherIndex += 8
                day++
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
        name = cityName.value[0].toUpperCase() + cityName.value.slice(1).toLowerCase();
        // console.log(name)
    } else {
        return
    }

    localStorage.setItem('city', name)
    cityName.value = ''

    //store searched city to a list
    createList(name)

    //
    getCurrentWeather(name)
}

const createList = (temp) => {
    let item = document.createElement('li')
    item.classList.add('list-group-item')
    item.textContent = temp
    item.addEventListener('click', function (e) {
        var item = e.target.textContent
        let stamps = document.querySelectorAll(".days")
        for (i = 0; i < stamps; i++) {
            stamps[i].innerHTML = ''
        }
        getCurrentWeather(item)
    })
    cityList.prepend(item)
}


searchBtn.addEventListener('click', renderSearch)
const lcity = localStorage.getItem('city')
if (lcity) {
    getCurrentWeather(lcity)
}

