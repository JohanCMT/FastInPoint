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
/* let database = firebase.database();
 let ref = database.ref('rutas/ruta1Directo');

 let data = {
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

function verificar() {
    let user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function () {

    }).catch(function (error) {

    });
}

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

const mymap = L.map('issMap', {
  minZoom: 8,
  maxZoom: 18
});

tiles.addTo(mymap);

mymap.setView([25.749247, -100.299161], 9);

//Marker with icon

const issIcon = L.icon({
    iconUrl: 'Ubi.png',
    iconSize: [55, 36],
    iconAnchor: [15, 8],
});
let firsTime2 = true;
let rutaTemp = "";

let marcador = false;



let database = firebase.database();






function iterador() {
    let arr = [];
    let ruta = document.getElementById("ruta").value;
    /*if (rutaTemp !== ruta) {
        firsTime2 = true;
        if(marcador){
          console.log("yeah bitch");
          busmarker.remove();
          busmarker = L.marker([-90, 0], {
             icon: issIcone
          }).addTo(mymap);
        }

        marcador = true;
    };

    let rutaTemp = ruta;
    */

    let ref = database.ref('rutas/' + ruta);
    ref.once('value', function (datos) {
        let info = datos.val();
        let keys = Object.keys(info);
        //console.log(keys);
        for(let j = 0; j< keys.length; j++){
          let refe = database.ref('rutas/' + ruta + '/' + keys[j] );
            refe.once('value', function(datose){
            let infoe = datose.val();
            //let keyse = Object.keys(infoe);
            //let k = keyse[keyse.length - 1];
            let altitud = infoe.altitud;
            let longitud = infoe.longitud;
            let capacidad = infoe.capacidad;
            const txt = '<p>Ruta: ' + keys[j] + '<br />Capacidad: ' + capacidad + '</p>';
            //arr.push(L.marker([altitud, longitud]));
            arr.push(L.marker([altitud, longitud], {
                icon: issIcone
            }).addTo(mymap));
            ;
            arr[j].bindPopup(txt);
          });
        }
    });
    console.log(arr);
      return arr;

}




function getData() {
    let ruta = document.getElementById("ruta").value;
    let arreglo=iterador();
    //console.log(arreglo[0]);
    /*if (rutaTemp !== ruta) {
        firsTime2 = true;
        if(marcador){
          console.log("yeah bitch");
          busmarker.remove();
          busmarker = L.marker([-90, 0], {
             icon: issIcone
          }).addTo(mymap);
        }

        marcador = true;
    };

    let rutaTemp = ruta;

    let ref = database.ref('rutas/' + ruta);
    ref.on('value', function (datos) {
        let info = datos.val();
        let keys = Object.keys(info);
        for(let j = 0; j< keys.length; j++){
          let refe = database.ref('rutas/' + ruta + '/' + keys[j] );
            refe.on('value', function(datose){
            let infoe = datose.val();
            //let keyse = Object.keys(infoe);
            //let k = keyse[keyse.length - 1];
            let altitud = infoe.altitud;
            let longitud = infoe.longitud;
            let capacidad = infoe.capacidad;
            const txt = '<p>Ruta: ' + keys[j] + '<br />Capacidad: ' + capacidad + '</p>';
            arreglo[j].setLatLng([altitud, longitud]);
            //arr[j].addTo(mymap)
            //arr[j].bindPopup(txt);

          })
        }
    })
      */
}







//_______________________________________________________________________________


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
