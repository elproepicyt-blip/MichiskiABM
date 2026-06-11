const API = "/api/precios";

async function cargarPrecios(){

    const res = await fetch(API);

    const precios = await res.json();

    const contenedor = document.getElementById("precios");

    contenedor.innerHTML = "";

    precios.forEach(precio => {

        contenedor.innerHTML += `
        <div class="card">

            <div>
                <b>ID:</b> ${precio.id}
                <br>
                <b>Producto:</b> ${precio.cod_producto}
                <br>
                <b>Fecha:</b> ${precio.fecha}
                <br>
                <b>Precio:</b> $${precio.precio}
            </div>

            <div class="acciones">

                <button onclick="editarPrecio(
                    ${precio.id},
                    ${precio.cod_producto},
                    '${precio.fecha}',
                    ${precio.precio}
                )">
                    Editar
                </button>

                <button onclick="eliminarPrecio(${precio.id})">
                    Eliminar
                </button>

            </div>

        </div>
        `;
    });
}

async function guardarPrecio(){

    const id = document.getElementById("id").value;

    const cod_producto = document.getElementById("cod_producto").value;

    const fecha = document.getElementById("fecha").value;

    const precio = document.getElementById("precio").value;

    if(!cod_producto || !fecha || !precio){
        return;
    }

    if(id){

        await fetch(API,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                id,
                cod_producto,
                fecha,
                precio
            })
        });

    }else{

        await fetch(API,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                cod_producto,
                fecha,
                precio
            })
        });
    }

    limpiarFormulario();

    cargarPrecios();
}

function editarPrecio(id,cod_producto,fecha,precio){

    document.getElementById("id").value = id;
    document.getElementById("cod_producto").value = cod_producto;
    document.getElementById("fecha").value = fecha;
    document.getElementById("precio").value = precio;
}

async function eliminarPrecio(id){

    if(!confirm("¿Eliminar precio?")){
        return;
    }

    await fetch(API + "?id=" + id,{
        method:"DELETE"
    });

    cargarPrecios();
}

function limpiarFormulario(){

    document.getElementById("id").value = "";
    document.getElementById("cod_producto").value = "";
    document.getElementById("fecha").value = "";
    document.getElementById("precio").value = "";
}

cargarPrecios();
