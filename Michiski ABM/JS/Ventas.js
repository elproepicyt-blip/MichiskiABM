const API = "/api/ventas";

async function cargarProductos(){

    const res = await fetch(API);

    const productos = await res.json();

    const contenedor = document.getElementById("productos");

    contenedor.innerHTML = "";

    productos.forEach(producto => {

        contenedor.innerHTML += `
        
        <div class="card">

            <div class="card-info">

                <h3>${producto.descripcion}</h3>

                <p>
                    Precio: $${producto.precio}
                </p>

            </div>

            <div class="acciones">

                <input
                    type="number"
                    min="1"
                    value="1"
                    id="cant_${producto.codigo}"
                >

                <button onclick="vender(${producto.codigo})">
                    Vender
                </button>

            </div>

        </div>
        `;
    });
}

async function vender(codigo){

    const cantidad = document.getElementById(
        `cant_${codigo}`
    ).value;

    const res = await fetch(API, {

        method: "POST",

        headers: {
            "Content-Type":"application/json"
        },

        body: JSON.stringify({
            codigo,
            cantidad
        })
    });

    const resultado = await res.json();

    alert(resultado.mensaje);
}

cargarProductos();
