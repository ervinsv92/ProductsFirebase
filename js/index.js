
  
  //Es un observador que verifica constantemente si hay un usuario logueado
  firebase.auth().onAuthStateChanged(function(user){
      if(user){
          //si el Usuario está loguiado
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.id;
          var providerData = user.providerData;

          document.getElementById("login").innerHTML = `<p>Logueado : ${email} ${emailVerified?'':'- No verificado'}</p><button onclick="cerrarSesion()">Cerrar sesión</button>`;
          document.location = "mant_productos.html"
      }else{
          //Si el usuario no está logiado
          document.getElementById("login").innerHTML = "No Logueado";
      }
  });

function enviar(){
    var email = document.getElementById("email").value;
    var pass = document.getElementById("pass").value;
    
    //Se crea el usuario y automaticamente lo loguea
    firebase.auth().createUserWithEmailAndPassword(email, pass)
    .then(function(){
        verificar();
    })
    .catch(function(error){
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(errorMessage);
    });
}

function verificar(){
    var user = firebase.auth().currentUser;
    user.sendEmailVerification().then(function(){
        //correo enviado
        console.log("Correo de verificación enviado")
    }).catch(function(error){
        //un error ocurrio
        console.error(error);
    });
}

function acceso(){
    var emailA = document.getElementById("emailA").value;
    var passA = document.getElementById("passA").value;
    
    firebase.auth().signInWithEmailAndPassword(emailA, passA).catch(function(){
        var errorCode = error.code;
        var errorMessage = error.message;
        console.error(errorMessage);
    });
}

function cerrarSesion(){
    firebase.auth().signOut()
    .then(function(){
        console.log("Salir");
    })
    .catch(function(error){
        console.error(error);
    });
}