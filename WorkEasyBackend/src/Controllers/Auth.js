import jwt from "jsonwebtoken";
import pkg from "mongodb";
const { ObjectID } = pkg;

import dotenv from "dotenv";
dotenv.config();
const { JWT_SECRET } = process.env;

const getToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "30 days" });
};

const getUserFromToken = async (token, db, JWT_SECRET) => {
  if (!token) {
    return null;
  }

  const tokenData = jwt.verify(token, JWT_SECRET);
  if (!tokenData) {
    return null;
  }
  return await db.collection("Users").findOne({ _id: ObjectID(tokenData.id) });
};

export { getToken, getUserFromToken };
