import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const JWT_SECRET=process.env.JWT_SECRET!;

export const hashPassword=(password:string) =>
  bcrypt.hash(password,10);

export const comparePassword=(password: string,hash:string) =>
  bcrypt.compare(password,hash);

export const signToken=(payload:object) =>
  jwt.sign(payload,JWT_SECRET,{expiresIn:"7d"});