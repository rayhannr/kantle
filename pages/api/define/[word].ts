import type { NextApiRequest, NextApiResponse } from "next";
import KBBI from "kbbi.js";

const PREFIXES = [
  "Isl",
  "Kim",
  "Kris",
  " Jk ",
  " Plb ",
  "dv cakJw ",
  "Dok",
  " cak ",
  "Graf",
  "Kat",
  "Anat",
  " akr ",
  "Sen",
  "Fis",
  "Olr",
  " ki ",
  "Kom",
];

const clearPrefix = (text: string) => {
  let updatedText = text;
  PREFIXES.forEach((prefix) => {
    updatedText = updatedText.startsWith(prefix) ? updatedText.replace(prefix, "") : updatedText;
  });
  return updatedText;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  KBBI.cari(req.query.word)
    .then((result: any) => {
      const updatedResult = { ...result };
      updatedResult.arti = result.arti.map((meaning: string) => clearPrefix(meaning));
      res.status(200).json(updatedResult);
    })
    .catch(() => {
      res.status(400).json({ message: "Word not found" });
    });
}
