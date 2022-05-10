// recupération de la latitude et de la longitude depuis l'API opencagedata
async function getGeometry() {
    let where = document.getElementById("ville").value;
    where = encodeURIComponent(where)
    console.log(where);
    const api_geo_key = '5f94c31fe86a4ad0ba4d4bf404643eeb';
    const api_url = `https://api.opencagedata.com/geocode/v1/json?key=${api_geo_key}&q=${where}&pretty=1&no_annotations=1`;
    let rep = await fetch(api_url);
    let reponse = await rep.json();
    const lat = reponse.results[0].geometry.lat;
    const lng = reponse.results[0].geometry.lng;
    console.log(lat + " " + lng);
    getMeteo(lat, lng);
}


// recupération de la méteo du lieu recherché
async function getMeteo(lat, lng) {
    const API_meteo_KEY = "9612067697a364bf80ed7e252bbc95e2";
    let urlMeteo = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${API_meteo_KEY}`
    let rep = await fetch(urlMeteo);
    let reponse = await rep.json();
    temps = reponse.current.weather[0].id;
    cloudsPercent = reponse.current.clouds;
    console.log("id = " + temps + " " + "nuages " + cloudsPercent + "%");
    writeHTML(temps, cloudsPercent)
}

// ecriture dans le DOM avec les données méteo

function writeHTML(temps, cloudsPercent) {
    let toDay = day();
    let jour = document.createElement("h2");
    jour.innerHTML = toDay;
    let resultat = document.querySelector("#resultat");
    resultat.appendChild(jour);
    let imgMeteo = document.createElement("img");
    if (temps === 800) {
        imgMeteo.src = `./img/sun.svg`;
        imgMeteo.style.width = "150px";
        resultat.appendChild(imgMeteo);
    } else if (temps > 600 && temps < 622) {
        imgMeteo.src = `./img/snow.svg`;
        imgMeteo.style.width = "150px";
        resultat.appendChild(imgMeteo);
    } else if (temps >= 801 && temps <= 804) {
        if (cloudsPercent <= 50) {
            imgMeteo.src = `./img/cloudy.svg`;
            imgMeteo.style.width = "150px";
            resultat.appendChild(imgMeteo);
        } else {
            imgMeteo.src = `./img/clouds.svg`;
            imgMeteo.style.width = "150px";
            resultat.appendChild(imgMeteo);
        }
    } else {
        imgMeteo.src = `./img/rain.svg`;
        imgMeteo.style.width = "150px";
        resultat.appendChild(imgMeteo);
    }
}

// transformation de l'objet date en string
function day() {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = new Date();
    console.log(days[d.getDay()]);
    return days[d.getDay()];
}

document.querySelector("#recherche").addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector("#resultat").innerHTML = "";
    getGeometry();
})



