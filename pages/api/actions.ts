// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { travelType } from "..";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const data = fs.existsSync("travel_data.json")
        ? JSON.parse(
              fs.readFileSync("travel_data.json", {
                  encoding: "utf8",
                  flag: "r",
              })
          )
        : [];
    if (req.method === "GET") {
        res.status(200).json(data);
    } else if (req.method === "POST")
        fs.writeFileSync("travel_data.json", JSON.stringify(req.body));
}
