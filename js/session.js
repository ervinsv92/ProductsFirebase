var _usuario;

//Es un observador que verifica constantemente si hay un usuario logueado
firebase.auth().onAuthStateChanged(function(user){
    if(user.emailVerified){
        _usuario = user;
    }else{
        document.location = "index.html"
    }
});

function cerrarSesion(){
    firebase.auth().signOut()
    .then(function(){
        window.location = "index.html"
        console.log("Salir");
    })
    .catch(function(error){
        console.error(error);
    });
}