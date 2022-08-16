
let stockProductos = []

//Consulto un json local

fetch("./data.json")
    .then((res) => res.json())
    .then((data) => {
        mostrarProductos(data);
    });

const mostrarProductos = (data) => {
    stockProductos = data;
    stockProductos.forEach((producto) => {
        const div = document.createElement('div');
        div.classList.add('producto');
        div.innerHTML = `
          <div class="card" style="width: 18rem;">
              <img src="${producto.imageURL}" class="card-img-top" alt="${producto.nombre}">
              <div class="card-body">
                  <h5 class="card-title text-dark">${producto.nombre}</h5>
                  <p class="card-text text-dark">$${producto.valor}</p>
                  <button id="agregar${producto.id}" class="boton-agregar">Agregar <i class="fas fa-shopping-cart"></i> </buttton>
              </div>
          </div>
          `
        contenedorProductos.appendChild(div)

        const boton = document.getElementById(`agregar${producto.id}`)

        boton.addEventListener('click', () => {
            agregarAlCarrito(producto.id)

            //esta funcion ejecuta el agregar el carrito con la id del producto

        })
    });
};


//Llamo a todos los elementos que voy a necesitar mediante DOM

const contenedorProductos = document.getElementById('contenedor-productos');
const contenedorCarrito = document.getElementById('carrito-contenedor');
const botonVaciar = document.getElementById('vaciar-carrito');
const contadorCarrito = document.getElementById('contadorCarrito');
const precioTotal = document.getElementById('precioTotal');


let carrito = [];


document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'));
        actualizarCarrito();
    }
})


//agrego el boton de vaciar carrito
botonVaciar.addEventListener('click', () => {
    carrito.length = 0;
    actualizarCarrito();
})

//recorro mi array de productos e inyecto en el HTML




//Agrego los productos al carrito

const agregarAlCarrito = (prodId) => {
    const existe = carrito.some(prod => prod.id === prodId);

    if (existe) {
        const prod = carrito.map(prod => {
            if (prod.id === prodId) {
                prod.cantidad++
            }
        })

    } else {
        const item = stockProductos.find((prod) => prod.id == prodId);
        carrito.push(item);
        console.log(carrito);
    }


    actualizarCarrito();

};


//Recorro el carrito y me fijo si contiene productos

const actualizarCarrito = () => {
    contenedorCarrito.innerHTML = "";
    carrito.forEach((prod) => {
        const div = document.createElement('div');
        div.className = ('productoEnCarrito');
        div.innerHTML =
            `<p>${prod.nombre}</p>
       <p>Precio: ${prod.valor}</p>
       <p>Cantidad: <span id="cantidad">${prod.cantidad}</span></p>
       <button onclick = "eliminarDelCarrito(${prod.id})" class="boton-eliminar"><i class="fas fa-trash-alt"></i></button>
      `
        contenedorCarrito.appendChild(div);

        //Almaceno la informacion del carrito para que no se borre si recargo la pagina
        localStorage.setItem('carrito', JSON.stringify(carrito));

    })

    contadorCarrito.innerText = carrito.length;
    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.valor, 0)

    precioTotal.innerText = carrito.reduce((acc, prod) => acc + prod.valor * prod.cantidad, 0);
};

//busco si existen los productos en el carrito y los borro

const eliminarDelCarrito = (prodId) => {

    const item = carrito.find((prod) => prod.id == prodId)
    const indice = carrito.indexOf(item); //Busca el elemento q yo le pase y me devuelve su indice.
    carrito.splice(indice, 1); //Le pasO el indice de mi elemento ITEM y borramos un elemento 
    actualizarCarrito(); //LLAMO A LA FUNCION actualizarCarrito. CADA VEZ Q SE MODIFICA EL CARRITO
}


const finalizarCompra = () => {
    contenedorCarrito.innerHTML = "";
    const compraFinal = `
    <div><p>Tu compra tiene un total de: $${precioTotal.innerText}</p>
      <div>
        <p>Complete el formulario para registar sus datos de envío</p>
        <button type="button" class="btn btn-success" onclick = "renderFormulario()"> FORMULARIO </button>
    </div>
    `
    contenedorCarrito.innerHTML = compraFinal;
};

const removeProduct = (indice) => {

    carrito.splice(indice, 1);
    actualizarCarrito();
  };

const renderFormulario = () => {
    contenedorCarrito.innerHTML = "";
    const formulario = `
    <form>
    <div class="mb-3">
        <label  class="form-label">Nombre Completo </label>
        <input type="text" id="nombre" class="form-control">
        <div id="emailHelp" class="form-text">Tu nombre para la entrega</div>
    </div>
      <div class="mb-3">
        <label  class="form-label"> Direccion de entrega </label>
        <input type="text" id="direccion" class="form-control">
        <div id="emailHelp" class="form-text">Rellena con calle, altura y CP.</div>
      </div>
      <div class="mb-3">
        <label  class="form-label"> Telefono de contacto </label>
        <input type="text" id="telefono" class="form-control">
        <div id="emailHelp" class="form-text">Tu celu para coordinar la entrega en caso que no te encuentres en la dirección.</div>
      </div>
  
      <input type="button" class="btn btn-primary" value="Enviar" id="boton_enviar" onclick="validarFormulario()">
    </form>
  
    `;
    contenedorCarrito.innerHTML = formulario;
}

//SWEET ALERT

function mostrarErrorCampo(campo) {
    Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: "Complete el campo " + campo,
        confirmButtonText: "Aceptar"
    });
}

function guardarDatos() {
    let campo_nombre = document.getElementById("nombre").value;
    let campo_direccion = document.getElementById("direccion").value;
    let campo_telefono = document.getElementById("telefono").value;
    localStorage.setItem("datos_formulario", JSON.stringify({nombre: campo_nombre, direccion: campo_direccion, telefono: campo_telefono }));
    console.log("Los datos se guardaron bien!");
}

function validarFormulario() {
    let campo_nombre = document.getElementById("nombre").value
    let campo_direccion = document.getElementById("direccion").value;
    let campo_telefono = document.getElementById("telefono").value;

    if(campo_nombre.length == 0){
        mostrarErrorCampo("nombre")
        return false
    }

    if (campo_direccion.length == 0) {
        mostrarErrorCampo("direccion")
        return false;
    }

    if (campo_telefono.length == 0) {
        mostrarErrorCampo("telefono")
        return false;
    }
    
    guardarDatos();
    mostrarFormEnviado();
}

function mostrarFormEnviado() {
    const nombreCliente = document.getElementById("nombre").value
    const domicilioCliente = document.getElementById("direccion").value
    contenedorCarrito.innerHTML = "";
    let mensaje = `<div class="mensaje-final"> MUCHAS GRACIAS POR SU COMPRA!!<br>
                                               &#8595 Apriete Vaciar para cargar nuevos productos &#8595
                  </div>`;
    contenedorCarrito.innerHTML = mensaje;
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: `Listo ${nombreCliente}, tu producto sera enviado a la direccion ${domicilioCliente} dentro de las 72hs hábiles!`,
        showConfirmButton: false,
        timer: 3500
    })
    let sacarPrecioTotal = document.getElementById("precioProducto");
    sacarPrecioTotal.innerHTML = ""
}


/* document.getElementById("boton_enviar").addEventListener("click", validarFormulario); */