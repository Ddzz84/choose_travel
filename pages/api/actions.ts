// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@vercel/postgres";
import { travelType } from "..";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        const result = await sql`SELECT * FROM flights;`;
        return res.status(200).json(result);
    } else if (req.method === "POST") {
        const result = await sql`SELECT * FROM flights ORDER BY id DESC;`;
        const lastid = parseInt(`${result.rows?.[0]?.id || 0}`);

        console.log(`INSERT INTO flights (id, country, city, flight, created_on) 
        VALUES (${lastid + 1}, '${req.body.country}','${
            req.body.city
        }','${JSON.stringify(req.body.flight)}',now()) 
        ON CONFLICT(id) DO UPDATE SET 
        country='${req.body.country}', city='${
            req.body.city
        }', flight='${JSON.stringify(req.body.flight)}' , rating=${
            req.body.rating
        } , updated_on=now();`);
        try {
            res.status(200).json(
                await sql`INSERT INTO flights (id, country, city, flight) 
            VALUES (${lastid + 1}, '${req.body.country}','${
                    req.body.city
                }','${JSON.stringify(req.body.flight)}') 
            ON CONFLICT(id) DO UPDATE SET 
            country='${req.body.country}', city='${
                    req.body.city
                }', flight='${JSON.stringify(req.body.flight)}' , rating='${
                    req.body?.rating ?? 1
                }' , updated_on=now();`
            );
        } catch (e) {
            res.status(501).json({ error: e });
        }
    }
}
