// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // ---------------------------------------------------------------
    if (req.method === "DELETE") {
        console.log("delete", req.query.id);
        res.json(await kv.del(`${req.query.id}`));
    } else if (req.method === "GET") {
        const list = await kv.keys("*");

        let travels = [];
        for (const k of list) travels.push(await kv.get(k));
        res.json(travels);
        // ----------------------------------------------------------
    } else if (req.method === "POST") {
        const r = await kv.set(`${req.body.id}`, JSON.stringify(req.body));

        res.send("ok");
    }
}
