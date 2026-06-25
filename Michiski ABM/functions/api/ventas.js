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

        const codigo = parseInt(data.codigo);

        const cantidad = parseInt(data.cantidad);

    // Buscar precio del producto

        const { results } = await DB.prepare(`
            SELECT precio
            FROM precios
            WHERE cod_producto = ?
            ORDER BY fecha DESC
            LIMIT 1
            `)
            .bind(codigo)
            .all();

        if(results.length === 0){

            return new Response(
                "No se encontró precio para el producto",
                { status: 400 }
                );
        }
        const precio_unitario = results[0].precio;

        const total = precio_unitario * cantidad;

// Intentar descontar stock (operación atómica)

        const resultado = await DB.prepare(`
            UPDATE stock
            SET cantidad = cantidad - ?
            WHERE cod_producto = ?
            AND cantidad >= ?
        `)
        .bind(
            cantidad,
            codigo,
            cantidad
        )
        .run();

// Si no modificó ninguna fila, no había stock suficiente

        if(resultado.meta.changes === 0){

            return new Response(
                "Stock insuficiente",
                { status:400 }
            );    
        }

// Registrar la venta

        await DB.prepare(`
            INSERT INTO ventas
            (
                cod_producto,
                cantidad,
                precio_unitario,
                total
            )
            VALUES (?, ?, ?, ?)
        `)
        .bind(
            codigo,
            cantidad,
            precio_unitario,
            total
        )
        .run();

        return new Response(
            "Venta registrada correctamente"
        );
    }
    return new Response(
        "Método no permitido",
        { status:405 }
    );
}
