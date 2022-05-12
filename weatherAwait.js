// recupération de la latitude et de la longitude depuis l'API opencagedata
async function getGeometry(city) {
    const api_geo_key = '5f94c31fe86a4ad0ba4d4bf404643eeb';
    const api_url = `https://api.opencagedata.com/geocode/v1/json?key=${api_geo_key}&q=${city}&pretty=1&no_annotations=1`;
    let rep = await fetch(api_url);
    let reponse = await rep.json();
    const lat = reponse.results[0].geometry.lat;
    const lng = reponse.results[0].geometry.lng;
    console.log(lat + " " + lng);
    return {lat, lng}
}

// recupération de la méteo du lieu recherché
async function getMeteo(obj) {
    const API_meteo_KEY = "9612067697a364bf80ed7e252bbc95e2";
    let urlMeteo = `https://api.openweathermap.org/data/2.5/onecall?lat=${obj.lat}&lon=${obj.lng}&appid=${API_meteo_KEY}`
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
    return {tempsWeek, dayNight};
}

// ecriture dans le DOM avec les données méteo de la semaine
function writeWeekHTML(objmMteo){
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
        let divDayImg = document.createElement("object");
        divDayImg.style.maxWidth = "100px";
        if(objmMteo.tempsWeek[index] === 800){
            divDayImg.data = `./img/sun.svg`; 
            divDay.appendChild(divDayImg);
        }else if (objmMteo.tempsWeek[index] >= 600 && objmMteo.tempsWeek[index] <= 622) {
            divDayImg.data = `./img/snow.svg`;
            divDay.appendChild(divDayImg);
        }else if (objmMteo.tempsWeek[index] >= 801 && objmMteo.tempsWeek[index] <= 802) {
                divDayImg.data = `./img/cloudy.svg`;
                divDay.appendChild(divDayImg);
        }else if(objmMteo.tempsWeek[index] >= 803 && objmMteo.tempsWeek[index] <= 804){
            divDayImg.data = `./img/clouds.svg`;
            divDay.appendChild(divDayImg);
        } else {
            divDayImg.data = `./img/rain.svg`;
            divDayImg.id = "rain";
            divDay.appendChild(divDayImg);
        }
        if (objmMteo.dayNight == 0) {
            document.body.style.backgroundColor = "darkblue";
            divDayImg.style.filter ="invert()";
        }else {
            document.body.style.backgroundColor = "lightblue";
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
    let city = document.getElementById("ville").value;
    city = encodeURIComponent(city)
    console.log(city);
    document.querySelector("#resultat").innerHTML = "";
    getGeometry(city).then(result => getMeteo(result)).then(display => writeWeekHTML(display));
})



