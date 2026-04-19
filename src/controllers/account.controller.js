import accountModel from "../models/account.model.js";

export async function createAccount(req, res) {
  try {
    const user = req.user;

    const account = await accountModel.create({
      user: user._id,
    });

    res.status(201).json({
      account,
    });
  } catch (error) {}
}

export async function getUserAccount(req, res) {
  const accounts = await accountModel.find({
    user: req.user._id,
  });

  res.status(200).json({
    accounts,
  });
}
