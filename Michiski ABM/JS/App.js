const API = "/api/articulos";

async function cargarArticulos(){

    const res = await fetch(API);

    const articulos = await res.json();

    const contenedor = document.getElementById("articulos");

    contenedor.innerHTML = "";

    articulos.forEach(articulo => {

        contenedor.innerHTML += `
        
        <div class="card">

            <span>${articulo.descripcion}</span>

            <div class="acciones">

                <button onclick="editarArticulo(
                    ${articulo.codigo},
                    '${articulo.descripcion.replace(/'/g,"\\'")}'
                )">
                    Editar
                </button>

                <button onclick="eliminarArticulo(${articulo.codigo})">
                    Eliminar
                </button>

            </div>

        </div>
        `;
    });
}

async function guardarArticulo(){

    const codigo = document.getElementById("codigo").value;

    const descripcion = document.getElementById("descripcion").value;

    if(descripcion.trim() === ""){
        return;
    }

    if(codigo){

        await fetch(API, {
            method: "PUT",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                codigo,
                descripcion
            })
        });

    } else {

        await fetch(API, {
            method: "POST",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({
                descripcion
            })
        });
    }

    limpiarFormulario();

    cargarArticulos();
}

function editarArticulo(codigo, descripcion){

    document.getElementById("codigo").value = codigo;

    document.getElementById("descripcion").value = descripcion;
}

async function eliminarArticulo(codigo){

    if(!confirm("¿Eliminar artículo?")){
        return;
    }

    await fetch(API + "?codigo=" + codigo, {
        method: "DELETE"
    });

    cargarArticulos();
}

function limpiarFormulario(){

    document.getElementById("codigo").value = "";

    document.getElementById("descripcion").value = "";
}

cargarArticulos();
