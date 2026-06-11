export async function onRequest(context){

    const DB = context.env.DB;

    const request = context.request;

    const url = new URL(request.url);

    if(request.method === "GET"){

        const { results } = await DB.prepare(
            "SELECT * FROM articulos ORDER BY codigo DESC"
        ).all();

        return Response.json(results);
    }

    if(request.method === "POST"){

        const data = await request.json();

        await DB.prepare(
            "INSERT INTO articulos (descripcion) VALUES (?)"
        )
        .bind(data.descripcion)
        .run();

        return new Response("Artículo agregado");
    }

    if(request.method === "PUT"){

        const data = await request.json();

        await DB.prepare(
            "UPDATE articulos SET descripcion=? WHERE codigo=?"
        )
        .bind(data.descripcion, data.codigo)
        .run();

        return new Response("Artículo actualizado");
    }

    if(request.method === "DELETE"){

        const codigo = url.searchParams.get("codigo");

        await DB.prepare(
            "DELETE FROM articulos WHERE codigo=?"
        )
        .bind(codigo)
        .run();

        return new Response("Artículo eliminado");
    }

    return new Response("Método no permitido", {
        status:405
    });
}
