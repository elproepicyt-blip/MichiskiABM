export async function onRequest(context){

    const DB = context.env.DB;

    const request = context.request;

    const url = new URL(request.url);

    if(request.method === "GET"){

        const { results } = await DB.prepare(
            "SELECT * FROM precios ORDER BY id DESC"
        ).all();

        return Response.json(results);
    }

    if(request.method === "POST"){

        const data = await request.json();

        await DB.prepare(
            `INSERT INTO precios
            (cod_producto, fecha, precio)
            VALUES (?, ?, ?)`
        )
        .bind(
            data.cod_producto,
            data.fecha,
            data.precio
        )
        .run();

        return new Response("Precio agregado");
    }

    if(request.method === "PUT"){

        const data = await request.json();

        await DB.prepare(
            `UPDATE precios
            SET cod_producto=?,
                fecha=?,
                precio=?
            WHERE id=?`
        )
        .bind(
            data.cod_producto,
            data.fecha,
            data.precio,
            data.id
        )
        .run();

        return new Response("Precio actualizado");
    }

    if(request.method === "DELETE"){

        const id = url.searchParams.get("id");

        await DB.prepare(
            "DELETE FROM precios WHERE id=?"
        )
        .bind(id)
        .run();

        return new Response("Precio eliminado");
    }

    return new Response("Método no permitido",{
        status:405
    });
}
