import { NextApiRequest, NextApiResponse } from "next";
import { ActivateAccount } from "@/services/auth-service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).json({ message: "Activation token is required" });
  }

  try {
    const result = await ActivateAccount(token);
    res.redirect("/login?activated=success");
  } catch (error) {
    res.redirect("/login?activated=error");
  }
}
