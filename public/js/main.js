// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyCDPwcK4USjJm-WbmsNYpeLFgkAiwSCOZo",
    authDomain: "fastinpoint-2.firebaseapp.com",
    databaseURL: "https://fastinpoint-2.firebaseio.com",
    projectId: "fastinpoint-2",
    storageBucket: "fastinpoint-2.appspot.com",
    messagingSenderId: "623847604416",
    appId: "1:623847604416:web:4614f991a0845025edad25",
    measurementId: "G-FBBTBYFFTH"
};

//--------------------------------------

firebase.initializeApp(firebaseConfig);
/* var database = firebase.database();
 var ref = database.ref('rutas/ruta1Directo');

 var data = {
   altitud: 105,
   longitud: 55,
   capacidad: "alta"
 }
 ref.push(data);

 ref.on('value', gotData, errData);

 function gotData(data){
   console.log(data.val());
 }
 function errData(err){
   console.log('Error!');
   console.log(err);
 }
 */

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var textoVerificado = "";
        if (emailVerified === false) {
            textoVerificado = "Email no verificado";
        } else {
            textoVerificado = "Email verificado";
        }
        var providerData = user.providerData;
        /*
        document.getElementById('login').innerHTML=
        `<p>Logueado `+user.email+` `+textoVerificado+`</p>
        <button type="button" class="btn btn-danger" onclick="cerrar()">Cerrar sesión</button>
        `;*/
        document.getElementById('botonAcceso').style.display = "none";
        document.getElementById('checkLogin').style.display = "none";
        document.getElementById('areaRegistro').style.display = "none";
        document.getElementById('passA').style.display = "none";
        document.getElementById('areaLogin').style.display = "";
        document.getElementById('btnCerrar').style.display = "";
        document.getElementById('emailA').value = email;
        console.log(user);
    } else {
        //  document.getElementById('login').innerHTML="No Logueado ";
        document.getElementById('botonAcceso').style.display = "";
        document.getElementById('checkLogin').style.display = "";
        document.getElementById('areaRegistro').style.display = "";
        document.getElementById('areaLogin').style.display = "none";
        document.getElementById('passA').style.display = "";
        document.getElementById('btnCerrar').style.display = "none";
    }
});

function enviar() {
    var email = document.getElementById('email').value;
    var pass = document.getElementById('pass').value;
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    }).then(function () {
        verificar();
    });
}

function verificar() {
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function () {

    }).catch(function (error) {

    });
}

function acceso() {
    var emailA = document.getElementById('emailA').value;
    var passA = document.getElementById('passA').value;
    firebase.auth().signInWithEmailAndPassword(emailA, passA).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
        // ...
    });
}

function cerrar() {
    firebase.auth().signOut()
        .then(function () {
            console.log('Salir');
        })
        .catch(function (error) {
            console.log(error)
        })
}
$(document).ready(function () {
    $('#loginRegistro').change(function () {
        if ($(this).is(':checked')) {
            $('#areaLogin').hide();
            $('#areaRegistro').show();
        } else {
            $('#areaLogin').show();
            $('#areaRegistro').hide();
        }
    });
});

//--------------------------------------

// Initialize Firebase
const issIcone = L.icon({
    iconUrl: 'Bus.png',
    iconSize: [60, 42],
    iconAnchor: [25, 16],
});


//--------------------------------------


//map and Title
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributos';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tiles = L.tileLayer(tileUrl, {
    attribution
});

const mymap = L.map('issMap').setView([0, 0], 1);

tiles.addTo(mymap);

//Marker with icon

const issIcon = L.icon({
    iconUrl: 'Ubi.png',
    iconSize: [55, 36],
    iconAnchor: [15, 8],
});
let firsTime2 = true;
let rutaTemp = "";
const busmarker = L.marker([-90, 0], {
    icon: issIcone
}).addTo(mymap);

function getData(busmaker) {
    var ruta = document.getElementById("ruta").value;
    if (rutaTemp !== ruta) {
        firsTime2 = true;
    };
    var rutaTemp = ruta;
    var database = firebase.database();
    var ref = database.ref('rutas/' + ruta);
    ref.on('value', function (datos) {
        var info = datos.val();
        var keys = Object.keys(info);
        k = keys[keys.length - 1];
        var altitud = info[k].altitud;
        var longitud = info[k].longitud;
        var capacidad = info[k].capacidad;

        //  document.getElementById('altitud').textContent = altitud;
        //  document.getElementById('longitud').textContent = longitud;
        //  document.getElementById('capacidad').textContent = capacidad;
        busmarker.setLatLng([altitud, longitud]);

        if (firsTime2) {
            mymap.flyTo([altitud, longitud], 15);
            firsTime2 = false;
        }
        const txt = '<p>Ruta: ' + ruta + '<br />Capacidad: ' + capacidad + '</p>';
        busmaker.bindPopup(txt);
    })
}


let firsTime = true;
const marker = L.marker([0, 0], {
    icon: issIcon
}).addTo(mymap);

async function getU() {
    console.log("geolocation is available ");
    navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        //document.getElementById('lat').textContent = latitude;
        //document.getElementById('long').textContent = longitude;
        marker.setLatLng([latitude, longitude]);
        if (firsTime) {
            mymap.setView([latitude, longitude], 15);
            firsTime = false;
        }
    });



    //  L.marker([latitude, longitude]).addTo(mymap);


}
getU();