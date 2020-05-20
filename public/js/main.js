// Your web app's Firebase configuration
let firebaseConfig = {
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
//Se hace autentificación del usuario
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        let displayName = user.displayName;
        let email = user.email;
        let emailVerified = user.emailVerified;
        let photoURL = user.photoURL;
        let isAnonymous = user.isAnonymous;
        let uid = user.uid;
        let textoVerificado = "";
        if (emailVerified === false) {
            textoVerificado = "Email no verificado";
        } else {
            textoVerificado = "Email verificado";
        }
        let providerData = user.providerData;
        document.getElementById('botonAcceso').style.display = "none";
        document.getElementById('checkLogin').style.display = "none";
        document.getElementById('areaRegistro').style.display = "none";
        document.getElementById('passA').style.display = "none";
        document.getElementById('areaLogin').style.display = "";
        document.getElementById('btnCerrar').style.display = "";
        document.getElementById('emailA').value = email;
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


//Se guarda al usuario con contraseña
function enviar() {
    let email = document.getElementById('email').value;
    let pass = document.getElementById('pass').value;
    firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function (error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        alert(errorMessage);
    }).then(function () {
        verificar();
    });
}
//Se envía un correo de verificación
function verificar() {
    let user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function () {

    }).catch(function (error) {

    });
}

//le permite al usuario logearse en la página
function acceso() {
    let emailA = document.getElementById('emailA').value;
    let passA = document.getElementById('passA').value;
    firebase.auth().signInWithEmailAndPassword(emailA, passA).catch(function (error) {
        // Handle Errors here.
        let errorCode = error.code;
        let errorMessage = error.message;
        alert(errorMessage);
        // ...
    });
}

//Le permite al usuario salir de su sesión

function cerrar() {
    firebase.auth().signOut()
        .then(function () {
            console.log('Salir');
        })
        .catch(function (error) {
            console.log(error)
        })
}

//Degine cuando enseñar la opción de registro o acceso
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

// Imagenes para usuario y camiones
const issIcone = L.icon({
    iconUrl: 'Bus.png',
    iconSize: [60, 42],
    iconAnchor: [25, 16],
});

const issIcon = L.icon({
    iconUrl: 'Ubi.png',
    iconSize: [55, 36],
    iconAnchor: [15, 8],
});



//--------------------------------------


//Agrega un mapa y titles de leaflet
const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributos';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const tiles = L.tileLayer(tileUrl, {
    attribution
});

const mymap = L.map('issMap', {
  minZoom: 8,
  maxZoom: 18
});

tiles.addTo(mymap);
mymap.setView([25.749247, -100.299161], 9);

//--------------------------------------


//Se definen variable de apoyos y se llama la base de datos
let firsTime2 = true;
let rutaTemp = "";
let marcador = false;
let database = firebase.database();

//Se crean los marcadores para cada camión de la ruta defina por el usuario
async function iterador() {
    let arr = [];
    let ruta = document.getElementById("ruta").value;
    if (ruta === '') return;
    let ref = database.ref('rutas/' + ruta);
    let idx = 1;
    let prom = await ref.once('value');
    let info = prom.val();
    let keys = Object.keys(info);

    for(let j = 0; j< keys.length; j++){
        let refe = database.ref('rutas/' + ruta + '/' + keys[j] );
        let resp = await refe.once('value');
        let infoe = resp.val();
        let altitud = infoe.altitud;
        let longitud = infoe.longitud;
        let capacidad = infoe.capacidad;
        const txt = '<p>Ruta: ' + keys[j] + '<br />Capacidad: ' + capacidad + '</p>';
        let newMarker = L.marker([altitud, longitud], {
            icon: issIcone
        }).addTo(mymap);
        newMarker.bindPopup(txt);
        arr.push(newMarker);
    }

    return [arr,keys];

}


//Se utilizan los marcadores y se actualizan según su cambio de posición
let prev = [];
async function getData()  {
    let ruta = document.getElementById("ruta").value;
    let [arreglo, llaves] = await iterador();
    for(let itera=0; itera<arreglo.length; itera++){

            let refi = database.ref('rutas/' + ruta + '/' + llaves[itera]);
            await refi.on('value', function(infoi){
            respi = infoi.val();
            let altitud = respi.altitud;
            let longitud = respi.longitud;
            let capacidad = respi.capacidad;
            const txt = '<p>Ruta: ' + llaves[itera] + '<br />Capacidad: ' + capacidad + '</p>';
            arreglo[itera].setLatLng([altitud, longitud]);
            arreglo[itera].bindPopup(txt);
          });

    }

    //Inicialmente se coloca la vista en el primer camión

    if (prev.length === 0 && arreglo.length !== 0) {
        mymap.setView(arreglo[0].getLatLng(), 15);
    }

    //Se borra el registro anterior  del marcador del mapa y se guarda el nuevo

    for (item of prev) {
      mymap.removeLayer(item);
    }

    prev = [];

    for (let i = 0; i < arreglo.length; i++) {
        let mark = arreglo[i];
        prev.push(mark);
    }


}

//--------------------------------------

//Se crea el marcador del usuario
let firsTime = true;
const marker = L.marker([0, 0], {
    icon: issIcon
}).addTo(mymap);

//Se obtiene la posición del usuario y se define su marcador
async function getU() {
    console.log("geolocation is available ");
    navigator.geolocation.getCurrentPosition(position => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        marker.setLatLng([latitude, longitude]);
        if (firsTime) {
            mymap.setView([latitude, longitude], 15);
            firsTime = false;
        }
    });

}
//Se llama la función para que se ejecute apenas inicie la página
getU();
