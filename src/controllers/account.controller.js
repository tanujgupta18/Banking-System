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
  } catch (error) {
    console.log("Create Account Error:", error);

    res.status(500).json({
      message: "Error creating account",
      error: error.message,
    });
  }
}

export async function getUserAccount(req, res) {
  const accounts = await accountModel.find({
    user: req.user._id,
  });

  res.status(200).json({
    accounts,
  });
}

export async function getAccountBalance(req, res) {
  const { accountId } = req.params;

  const account = await accountModel.findOne({
    _id: accountId,
    user: req.user._id,
  });

  if (!account) {
    return res.status(400).json({
      message: "Account not found",
    });
  }

  const balance = await account.getBalance();
  return res.status(200).json({
    accountId: account._id,
    balance: balance,
  });
}
