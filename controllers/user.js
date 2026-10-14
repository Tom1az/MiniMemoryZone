import { db } from "../src/prisma/db.ts";
import bcrypt from "bcrypt";
import "dotenv/config";

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

const replaceUser = async (req, res, next) => {
  const { userID } = req.params;
  const { email, fullName, password } = req.value.body;

  try {
    const toReplacedUser = await Users.first({ userID });

    if (!toReplacedUser) {
      return res.status(404).json({
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
  getUser,
  replaceUser,
  updateUser,
};
