// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { put, list } from "@vercel/blob";
import { travelType } from "..";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === "GET") {
        res.status(200).json(
            (await list({ token: process.env.BLOB_READ_WRITE_TOKEN })) || []
        );
    } else if (req.method === "POST") {
        const blob = await put("travel_data.json", JSON.stringify(req.body), {
            access: "public",
            contentType: "json",
            token: process.env.BLOB_READ_WRITE_TOKEN,
        });
        return res.json(blob);
    }
}
