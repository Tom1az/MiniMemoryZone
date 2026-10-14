import { db } from "../src/prisma/db.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

const saltRounds = 10;

const Users = db.orm.public.Users;

const encodedToken = (userID) => {
  return jwt.sign(
    {
      iss: "Nghia Tran",
      sub: userID,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 3),
    },
    process.env.JWT_SECRET,
  );
};

async function createUser(data) {
  const hash = await bcrypt.hash(data.password, saltRounds);

  return Users.create({
    email: data.email,
    fullName: data.fullName,
    hashedPass: hash,
  });
}

const signIn = async (req, res, next) => {
  const { email, password } = req.value.body;

  try {
    const user = await Users.first({ email });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.hashedPass);

      if (passwordMatch) {
        const token = encodedToken(user.userId);

        res.setHeader("Authorization", token);

        return res.status(200).json({
          message: "Sign in successfully",
        });
      } else {
        return res.status(400).json({
          message: "Incorrect password!",
        });
      }
    } else {
      return res.status(404).json({
        message: "User not found",
      });
    }
  } catch (err) {
    return next(err);
  }
};

const signUp = async (req, res, next) => {
  const { email, fullName, password } = req.value.body;

  const existedUser = await Users.first({ email });

  if (existedUser) {
    return res.status(401).json({
      message: "User existed, please log in",
    });
  }

  const user = await createUser(req.value.body);
  //Encode token
  const token = encodedToken(user.userId);

  //return the token in HEADER!!!
  res.setHeader("Authorization", token);

  return res.status(200).json({
    user: {
      userId: user.userId,
      email: user.email,
      fullName: user.fullName,
    },
    message: "Sign up successfully",
  });
};

export default {
  signIn,
  signUp,
};
