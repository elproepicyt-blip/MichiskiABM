const API = "../functions/api/ventas";

let productos = [];

async function cargarProductos(){

    const res = await fetch(API);

    productos = await res.json();

    const combo = document.getElementById("producto");

    productos.forEach(producto => {

        combo.innerHTML += `
            <option value="${producto.codigo}">
                ${producto.descripcion}
            </option>
        `;
    });
}

document
.getElementById("producto")
.addEventListener("change", function(){

    const codigo = Number(this.value);

    const producto = productos.find(
        p => p.codigo === codigo
    );

    document.getElementById("precio").value =
        producto ? producto.precio : "";
});

async function vender(){

    const codigo =
        document.getElementById("producto").value;

    const cantidad =
        document.getElementById("cantidad").value;

    if(!codigo){

        alert("Seleccione un producto");

        return;
    }

    const res = await fetch(API,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({
            codigo,
            cantidad
        })
    });

    const resultado = await res.text();

    alert(resultado);
}

cargarProductos();
