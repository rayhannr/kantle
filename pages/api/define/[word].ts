import type { NextApiRequest, NextApiResponse } from "next";
import KBBI from "kbbi.js";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  KBBI.cari(req.query.word)
    .then((result: any) => {
      const updatedResult = { ...result };
      updatedResult.arti = result.arti.map((meaning: string) => {
        return meaning.startsWith("Isl") ? meaning.replace("Isl", "") : meaning;
      });
      res.status(200).json(updatedResult);
    })
    .catch(() => {
      res.status(400).json({ message: "Word not found" });
    });
}
