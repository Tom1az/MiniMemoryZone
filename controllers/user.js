import {db} from "../src/prisma/db.ts";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config'

const saltRounds = 10;

const Users = db.orm.public.Users;

// const newUser = async (req, res, next) => {
//     //Callback
//     console.log('req.body content: ', req.body);

//     //create object model
//     const newUser = await Users.create({
//         ...req.body
//     });

//     return res.status(201).json({
//         newUser,
//         message: 'You created a new user'
//     })
// };

// const index = (req, res, next) => {
//     //Promise way
//     Users.all().then((users) => {
//         return res.status(200).json({
//             users,
//             message: 'You requested the list of users'
//         });
//     }).catch((err) => next(err));
// }

const encodedToken = (userID) => {
  return jwt.sign({
    iss: 'Nghia Tran',
    sub: userID,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 3)
  }, process.env.JWT_SECRET)
}

const getUser = async (req, res, next) => {
  console.log("req params: ", req.params);

  const { userID } = req.value.params;

  const user = await Users.first({ userId: userID });
  console.log("user info: ", user);

  return res.status(200).json({
    user,
    message: "Found a user",
  });
};

const index = async (req, res, next) => {
  try {
    const users = await Users.all();
    // throw new Error('Simulated error for testing error handling'); // Simulate an error for testing
    return res.status(200).json({
      users,
      message: "You requested the list of users",
    });
  } catch (err) {
    next(err);
  }
};

async function createUser(data) {
  const hash = await bcrypt.hash(data.password, saltRounds);

  return Users.create({
    email: data.email,
    fullName: data.fullName,
    hashedPass: hash,
  });
}

const newUser = async (req, res, next) => {
  try {
    const newUser = await createUser(req.value.body);

    return res.status(201).json({
      newUser,
      message: "You created a new user",
    });
  } catch (error) {
    return next(error);
  }
};

const replaceUser = async (req, res, next) => {
  const { userID } = req.params;
  const { email, fullName, password } = req.value.body;

  try {
    const toReplacedUser = await Users.first({ userID });

    if (!toReplacedUser) {
      return res.status(400).json({
        message: "User not found!",
      });
    }

    const hashedPass = await bcrypt.hash(password, saltRounds);

    await Users.where({ userId: userID }).update({
      email,
      fullName,
      hashedPass,
    });

    return res.status(201).json({
      user: {
        userID,
        email,
        fullName,
      },
      message: "You replaced a user",
    });
  } catch (error) {
    return next(error);
  }
};

const secret = async (req, res, next) => {};

const signIn = async (req, res, next) => {};

const signUp = async (req, res, next) => {
  const { email, fullName, password } = req.value.body;

  const existedUser = await Users.first({ email });

  if (existedUser) {
    return res.status(403).json({
      message: "User existed, please log in",
    });
  }

  const user = await createUser(req.value.body);
  //Encode token
  const token = encodedToken(user.userId);

  //return the token in HEADER!!!
  res.setHeader('Authorization', token);

  return res.status(200).json({
    user: {
      userId: user.userId,
      email: user.email,
      fullName: user.fullName
    },
    message: 'Sign up successfully'
  })
};

const updateUser = async (req, res, next) => {
  const { userID } = req.params;
  const newUser = req.value.body;

  const result = await Users.where({ userId: userID }).update({
    ...newUser,
  });

  return res.status(200).json({
    result,
    message: "Successfully updated",
  });
};

export default {
  index,
  newUser,
  getUser,
  replaceUser,
  secret,
  signIn,
  signUp,
  updateUser,
};
