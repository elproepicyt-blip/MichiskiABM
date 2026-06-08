const API = "/functions/usuarios.js";

async function cargarUsuarios(){

    const res = await fetch(API);

    const usuarios = await res.json();

    const contenedor = document.getElementById("usuarios");

    contenedor.innerHTML = "";

    usuarios.forEach(usuario => {

        contenedor.innerHTML += `
        
        <div class="card">

            <div>
                ${usuario.nombre}
            </div>

            <div class="acciones">

                <button onclick="editarUsuario(${usuario.id}, '${usuario.nombre}')">
                    Editar
                </button>

                <button onclick="eliminarUsuario(${usuario.id})">
                    Eliminar
                </button>

            </div>

        </div>
        `;
    });
}

async function guardarUsuario(){

    const id = document.getElementById("usuarioId").value;

    const nombre = document.getElementById("nombre").value;

    if(nombre.trim() === ""){
        return;
    }

    if(id){

        await fetch(API, {
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                id,
                nombre
            })
        });

    }else{

        await fetch(API, {
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                nombre
            })
        });
    }

    limpiarFormulario();

    cargarUsuarios();
}

function editarUsuario(id, nombre){

    document.getElementById("usuarioId").value = id;

    document.getElementById("nombre").value = nombre;
}

async function eliminarUsuario(id){

    await fetch(API + "?id=" + id, {
        method:"DELETE"
    });

    cargarUsuarios();
}

function limpiarFormulario(){

    document.getElementById("usuarioId").value = "";

    document.getElementById("nombre").value = "";
}

cargarUsuarios();