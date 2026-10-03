import { db } from "../src/prisma/db.ts";
import "temporal-polyfill/full/global";
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

  const { userID } = req.params;

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
  console.log("req.body content: ", req.body);

  try {
    const newUser = await Users.create({
      ...req.body,
    });

    return res.status(201).json({
      newUser,
      message: "You created a new user",
    });
  } catch (err) {
    next(err);
  }
};

const validateForReplaceUser = Joi.object({
  email: Joi.string().email().required(),
  fullName: Joi.string().trim().min(3).max(30).required(),
  password: Joi.string().min(8).required(),
});

const replaceUser = async (req, res, next) => {
  const { userID } = req.params;
  const newUser = req.body;

  const { error, value } = validateForReplaceUser.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      error: error.details.map((detail) => detail.message),
    });
  }

  const hashedPass = await bcrypt.hash(
    value.password,
    saltRounds,
    async function (err, hash) {
      try {
        const replacedUser = {
          email: value.email,
          fullName: value.fullName,
          hashedPass: hashedPass,
        };

        console.log("newUser info: ", newUser);

        await Users.where({ userId: userID }).update(replacedUser);
      } catch (error) {
        next(error);
      }
    },
  );

  return res.status(200).json({
    result: {
      userId: userID,
      email: value.email,
      fullName: value.fullName,
    },
    message: "Successfully replaced",
  });
};

const updateUser = async (req, res, next) => {
  const { userID } = req.params;
  const newUser = req.body;

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
