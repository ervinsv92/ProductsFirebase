
/*
firebase.initializeApp({
    apiKey: 'AIzaSyCDOUZR7--jw4fqCOxYO0LVJ7lsPTpmR9U',
    authDomain: 'pymeproducts-3ac69.firebaseapp.com',
    projectId: 'pymeproducts-3ac69'
  });
  
  var db = firebase.firestore();
  */
var txtNombre = document.getElementById('txtNombre')
var txtPrecio = document.getElementById('txtPrecio')
var btnGuardar = document.getElementById('btnGuardar')
var fImagen = document.getElementById('fImagen')
var pArchivo = document.getElementById('pArchivo')
var rutaArchivo;
var _producto = null;

window.onload = function(){
    setTimeout(() => {
        document.getElementById('emailUsuario').innerHTML = "Bienvenido " + _usuario.email;
    }, 700);
}

function guardarProducto(producto){
    
    if(producto.hasOwnProperty('id')){

        var productoBD = db.collection("productos").doc(producto.id);
        producto.rutaArchivo = rutaArchivo!=""?rutaArchivo:producto.rutaArchivo;

        productoBD.update(
            {
                nombre:producto.nombre,
                precio:producto.precio,
                rutaArchivo:producto.rutaArchivo
            }
        ).then(function(docRef){
            limpiarFormProductos();
            alert("Producto actualizado")
        }).catch(function(error){
            alert("Error")
            console.error(error);
        });
    }else{
        db.collection("productos").add({
            nombre:producto.nombre,
            precio:producto.precio,
            rutaArchivo:rutaArchivo
        })
        .then(function(docRef) {
            limpiarFormProductos();
            alert("Producto guardado")
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            alert("Error al guardar")
            console.error("Error adding document: ", error);
        });
    }
}

function validarFormProductos(){
    if(txtNombre.value.trim() == ""){
        alert("Debe ingresar el nombre del producto")
        return false;
    }else if(txtPrecio.value.trim() == "" || isNaN(txtPrecio.value.trim()) || parseFloat(txtPrecio.value.trim())<=0){
        alert("El precio deber ser un numero mayor a 0")
        return false;
    }else if(fImagen.files.length <= 0){
        alert("Debe cargar la imagen del producto")
        return false;
    }

    return true;
}

function limpiarFormProductos(){
    txtNombre.value = "";
    txtPrecio.value = "";
    fImagen.value = null;
    pArchivo.value = "0";
    _producto = null;
    btnGuardar.textContent = "Guardar"
}

db.collection("productos").onSnapshot((querySnapshot) => {
    let tabla = document.querySelector("#tablaProductos tbody");
    tabla.innerHTML = ""
    querySnapshot.forEach((producto) => {

        let trString = `
            <td>${producto.data().nombre}</td>
            <td>${producto.data().precio}</td>
            <td>
                <button type='button' data-producto='${JSON.stringify(producto.data())}' data-id='${producto.id}' onclick="cargaProducto()" class='btn btn-warning btnModificar'>M</button>
                <button type='button' data-producto='${JSON.stringify(producto.data())}' data-id='${producto.id}' onclick="eliminaProducto()" class='btn btn-danger btnEliminar'>X</button>
            </td>
        `
        let tr = document.createElement('tr')
        tr.innerHTML = trString
        tabla.append(tr)
        console.log(`${producto.id} => ${producto.data()}`);
    });
});


document.addEventListener('click', function (event) {    
    if(event.target.matches('.btnModificar')){
        // Don't follow the link
        cargaProducto(event);
        event.preventDefault();
        
    }else if(event.target.matches('.btnEliminar')){
        // Don't follow the link
        eliminaProducto(event)
        event.preventDefault();
    }else if(event.target.matches('#btnGuardar')){
        
        if(!validarFormProductos()){
            return;
        }
        
        let producto = {}
    
        if(_producto!= null){
            producto = {
                id:_producto.id,
                nombre: txtNombre.value,
                precio: parseFloat(txtPrecio.value)
            }
        }else{
            producto = {   
                //'id':"",         
                nombre: txtNombre.value,
                precio: parseFloat(txtPrecio.value)
            }
        }     
        
        guardarProducto(producto);   
    }
}, false);

fImagen.addEventListener('change', function(e){
    var file = e.target.files[0];
    var storageRef = firebase.storage().ref('imagenes/'+file.name);
    var task = storageRef.put(file);
    task.on('state_changed', 
        function progress(snapshot){
            var porcentaje = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            pArchivo.value = porcentaje;
        },
        function error(err){

        },
        function complete(){
            rutaArchivo = "imagenes/"+file.name;
        }
    );
});

function cargaProducto(e){
    _producto = JSON.parse(e.target.dataset.producto);
    _producto.id = e.target.dataset.id;

    txtNombre.value = _producto.nombre;
    txtPrecio.value = _producto.precio;
    btnGuardar.textContent = "Modificar"
}

function eliminaProducto(e){
    let id = e.target.dataset.id;
    if(!confirm("¿Esta seguro que desea eliminar el producto?")){
        return;
    }
    
    db.collection("productos").doc(id).delete().then(function() {
        alert("Producto eliminado");
    }).catch(function(error) {
        alert("Error al borrar producto");
        console.error("Error removing document: ", error);
    });
}

