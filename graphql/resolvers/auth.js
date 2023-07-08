const User = require("../../models/user");
const bcrypt = require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  createUser: async (args) => {
    try {
      const email = args.userInput.email;
      const pass = args.userInput.password;
      const createduser = await User.findOne({ email: email });
      if (createduser) {
        throw new Error("User already exist");
      }

      const hashedpass = await bcrypt.hash(pass, 12);
      const user = new User({
        email: email,
        password: hashedpass,
      });
      const result = await user.save();
      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("User does not exist");
    }

    const rightPass = await bcrypt.compare(password, user.password);
    if (!rightPass) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      "somesupersecretkey",
      { expiresIn: "1h" }
    );
    return {userId: user.id, token: token, tokenExpiration: 1}
  },
};
