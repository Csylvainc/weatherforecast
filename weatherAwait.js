// recupération de la latitude et de la longitude depuis l'API opencagedata
async function getGeometry() {
    const cacheVersion = 1;
    const cacheName = `weatherApp-${cacheVersion}`;
    const api_geo_key = '5f94c31fe86a4ad0ba4d4bf404643eeb';
    const api_url = `https://api.opencagedata.com/geocode/v1/json?key=${api_geo_key}&q=${where}&pretty=1&no_annotations=1`;
    let cacheData = await getCacheData(cacheName, api_url);
    let where = document.getElementById("ville").value;
    where = encodeURIComponent(where)
    console.log(where);
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
    tempsJ0 = reponse.current.weather[0].id;
    cloudsPercent = reponse.current.clouds;
    let tempsWeek = [];
    nbJours = document.querySelector("#nbJour").value;

    for(j=0; j<=nbJours;j++){
        tempsWeek.push(reponse.daily[j].weather[0].id);
    }
    
    let dayNight = reponse.current.uvi;
    console.log(tempsWeek);
    //appel de la fonction pour météo de la semaine
    writeWeekHTML(tempsWeek, dayNight);
}

// ecriture dans le DOM avec les données méteo de la semaine
function writeWeekHTML(tempsWeek, dayNight){
    if (dayNight == 0) {
        document.body.style.backgroundColor = "darkblue";
    }else {
        document.body.style.backgroundColor = "lightblue";
    }
    let myWeek = week();
    console.log(myWeek);
    let resultat = document.querySelector("#resultat");
    for (let index = 0; index < myWeek.length; index++) {
        const element = myWeek[index];
        let divDay = document.createElement("div");
        resultat.appendChild(divDay);
        let divDayH3 = document.createElement("h3");
        divDay.appendChild(divDayH3);
        divDayH3.innerHTML = element;
        let divDayImg = document.createElement("img");
        divDayImg.style.maxWidth = "100px";
        if(tempsWeek[index] === 800){
            divDayImg.src = `./img/sun.svg`; 
            divDay.appendChild(divDayImg);
        }else if (tempsWeek[index] >= 600 && tempsWeek[index] <= 622) {
            divDayImg.src = `./img/snow.svg`;
            divDay.appendChild(divDayImg);
        }else if (tempsWeek[index] >= 801 && tempsWeek[index] <= 802) {
                divDayImg.src = `./img/cloudy.svg`;
                divDay.appendChild(divDayImg);
        }else if(tempsWeek[index] >= 803 && tempsWeek[index] <= 804){
            divDayImg.src = `./img/clouds.svg`;
            divDay.appendChild(divDayImg);
        } else {
            divDayImg.src = `./img/rain.svg`;
            divDay.appendChild(divDayImg);
        }
        
    }
}


// tableau de la semaine commencant par aujourd'hui
function week(){
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = new Date();
    d = d.getDay();
    let week = [];
    for(let i = d; i < days.length ; i++){
        week.push(days[i]);
    }
    for(let pastJ = 0 ; pastJ < d ; pastJ++ ){
        week.push(days[pastJ]);
    }
    // modification du tableau en fonction du nombre de jours demandés par l'utilisateur
    nbJours = document.querySelector("#nbJour").value;
    week = week.slice(0, nbJours);
    return week
}


// Action au clic sur le bouton submit
document.querySelector("#recherche").addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector("#resultat").innerHTML = "";
    getGeometry();
})



