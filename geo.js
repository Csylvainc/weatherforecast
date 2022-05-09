function day() {
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let d = new Date();
    return days[d.getDay()];
}

let recherche = document.querySelector("#recherche");

recherche.addEventListener("click", function (e) {
    e.preventDefault();
    let ville = document.getElementById("ville").value;
    console.log(ville);

    var api_key = '5f94c31fe86a4ad0ba4d4bf404643eeb';
    var api_url = 'https://api.opencagedata.com/geocode/v1/json';

    var request_url = api_url
        + '?'
        + 'key=' + api_key
        + '&q=' + encodeURIComponent(ville)
        + '&pretty=1'
        + '&no_annotations=1';

    // see full list of required and optional parameters:
    // https://opencagedata.com/api#forward

    var request = new XMLHttpRequest();
    request.open('GET', request_url, true);

    request.onload = function () {
        // see full list of possible response codes:
        // https://opencagedata.com/api#codes

        if (request.status === 200) {
            // Success!
            let data = JSON.parse(request.responseText);
            var lat = data.results[0].geometry.lat;
            var lng = data.results[0].geometry.lng
            const API_KEY = "9612067697a364bf80ed7e252bbc95e2"
            //let URL = `https://api.opencagedata.com/geocode/v1/json?q=Berlin&key=${API_KEY}&language=fr&pretty=1`
            let urlMeteo = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=${API_KEY}`
            fetch(urlMeteo) // on utilise la methode fetch, qui est asynchrone et qui existe par défaut dans le navigateur (on aurait aussi pu utiliser la librairie axios par exemple)
                // on utilise la méthode then() (NB: on pourrait aussi utiliser la syntaxe async/await)
                .then(response => {
                    if (response.status == 200) { // on vérifier que l'appel à l'API a fonctionné
                        return response.json()  // ne pas oublier le return du callback
                    }
                    else console.log(`Erreur lorsqu'on a tenté de récupérer les data`);
                })
                .then(cityWeather => {
                    console.log(urlMeteo)
                    console.log(lat+" "+ lng);
                    console.log(cityWeather);
                    temps = cityWeather.current.weather[0].main;
                    let resultat = document.querySelector("#resultat");
                    let votreVille = document.createElement("h2");
                    let toDay = day();
                    
                    votreVille.innerHTML = `${toDay} dans la ville de${ville} le temps est ${temps}`;
                    resultat.appendChild(votreVille);
                    let imgMeteo = document.createElement("img");
                    switch (temps) {
                        case "Rain":
                            imgMeteo.src = `./img/rain.svg`
                            break;
                        case "Clear":
                            imgMeteo.src = `./img/sun.svg`
                        
                        default:
                            break;
                    }
                    resultat.appendChild(imgMeteo);
                    
                })  
                .catch(err => console.log(err))
        
            //console.log(lat + " " + lng);
            // print the location

        } else if (request.status <= 500) {
            // We reached our target server, but it returned an error

            console.log("unable to geocode! Response code: " + request.status);
            var data = JSON.parse(request.responseText);
            console.log('error msg: ' + data.status.message);
        } else {
            console.log("server error");
        }
    };

    request.onerror = function () {
        // There was a connection error of some sort
        console.log("unable to connect to server");
    };

    request.send();

  
});

