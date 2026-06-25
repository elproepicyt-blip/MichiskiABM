export async function onRequest(context){

    const DB = context.env.DB;

    const request = context.request;

    if(request.method === "GET"){

        const { results } = await DB.prepare(`
            SELECT
                a.codigo,
                a.descripcion,
                p.precio
            FROM articulos a
            INNER JOIN precios p
                ON p.cod_producto = a.codigo
            ORDER BY a.descripcion
        `).all();

        return Response.json(results);
    }

    if(request.method === "POST"){

        const data = await request.json();

        const codigo = data.codigo;

        const cantidad = data.cantidad;

        return new Response(
            `Venta realizada.
             Producto: ${codigo}
             Cantidad: ${cantidad}`
        );
    }

    return new Response(
        "Método no permitido",
        { status:405 }
    );
}
