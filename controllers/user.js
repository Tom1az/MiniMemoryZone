import { db } from "../src/prisma/db.ts";
import Joi from "joi";
import bcrypt from "bcrypt";

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

const newUser = async (req, res, next) => {
  const newUser = req.value.body; 
  
  bcrypt.hash(newUser.password, saltRounds, async function (hashErr, hash) {
      if (hashErr) {
        return next(hashErr);
      }

      try {
        await Users.create ({
          email: newUser.email,
          fullName: newUser.fullName,
          hashedPass: hash,
        });

        console.log("newUser info: ", newUser);

        return res.status(201).json({
          newUser,
          message: "You created a new user",
        })
      } catch (error) {
        next(error);
      }
    }
  );
};

const replaceUser = async (req, res, next) => {
  const { userID } = req.params;
  const newUser = req.value.body;

  bcrypt.hash(newUser.password, saltRounds, async function (hashErr, hash) {
      if (hashErr) {
        return next(hashErr);
      }

      try {
        const replacedUser = {
          email: newUser.email,
          fullName: newUser.fullName,
          hashedPass: hash,
        };

        await Users.where({ userId: userID }).update(replacedUser);

        console.log("newUser info: ", newUser);

        return res.status(201).json({
          newUser,
          message: "You replaced a user",
        })
      } catch (error) {
        next(error);
      }
    }
  );
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
  updateUser,
};
