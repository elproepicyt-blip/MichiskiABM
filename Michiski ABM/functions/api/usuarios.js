export async function onRequest(context){

    const DB = context.env.DB;

    const request = context.request;

    const url = new URL(request.url);

    // GET
    if(request.method === "GET"){

        const { results } = await DB.prepare(
            "SELECT * FROM usuarios ORDER BY id DESC"
        ).all();

        return Response.json(results);
    }

    // POST
    if(request.method === "POST"){

        const data = await request.json();

        await DB.prepare(
            "INSERT INTO usuarios (nombre) VALUES (?)"
        )
        .bind(data.nombre)
        .run();

        return new Response("Usuario creado");
    }

    // PUT
    if(request.method === "PUT"){

        const data = await request.json();

        await DB.prepare(
            "UPDATE usuarios SET nombre=? WHERE id=?"
        )
        .bind(data.nombre, data.id)
        .run();

        return new Response("Usuario actualizado");
    }

    // DELETE
    if(request.method === "DELETE"){

        const id = url.searchParams.get("id");

        await DB.prepare(
            "DELETE FROM usuarios WHERE id=?"
        )
        .bind(id)
        .run();

        return new Response("Usuario eliminado");
    }

    return new Response("Not Found", {
        status:404
    });
}