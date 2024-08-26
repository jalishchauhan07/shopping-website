const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const OAuthStrategy = require("passport-oauth2").Strategy;
const crypto = require("crypto");
const mail = require("../mail/mail");
const checkAuth = require("../middleware/checkAuthenticate");
const user = require("../model/user");

router.post("/profile", checkAuth, async (req: any, res: any) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    const userInfo = await user.findOne({ email }, { _id: 0, password: 0 });
    if (!userInfo) {
      return res.status(404).send({ message: "User is not found" });
    }
    return res.status(200).send({ data: userInfo });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});
router.post("/updatePassword", checkAuth, async (req: any, res: any) => {
  try {
    const { email, newPassword, newToken } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    const hashPassword = bcrypt.hash(newPassword, 10);
    const userInfo = await user.updateOne(
      { email },
      { password: hashPassword }
    );
    if (!userInfo) {
      return res.status(404).send({ message: "User is not found" });
    }
    return res.status(200).send({ data: userInfo });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/changePassword", checkAuth, async (req: any, res: any) => {
  try {
    const { email, newPassword, oldPassword, newToken } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    const userInfo_ = await user.findOne({ email });
    if (!userInfo_) {
      return res.status(404).send({ message: "User is not found" });
    }
    const hash = await bcrypt.compare(oldPassword, userInfo_.password);
    if (!hash) {
      return res.status(401).send({ message: "UnAuthorization User" });
    }
    const hashPassword = bcrypt.hash(newPassword, 10);
    const userInfo = await user.updateOne(
      { email },
      { password: hashPassword }
    );
    if (!userInfo) {
      return res.status(404).send({ message: "User is not found" });
    }
    return res.status(200).send({ data: userInfo });
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/forgetPassword", async (req: any, res: any) => {
  try {
    const { email } = req.body;

    // Generate a random initialization vector
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(
      "aes-128-cbc",
      Buffer.from("f2a6e85f66ad1b8932d13c3835591256", "hex"), // Ensure secretKey is 16 bytes
      iv
    );

    let encryptedEmail = cipher.update(
      JSON.stringify({ email }),
      "utf-8",
      "hex"
    );
    encryptedEmail += cipher.final("hex");
    const token = `${iv.toString("hex")}:${encryptedEmail}`;

    await mail(email, token);
    return res.status(200).send({ message: "Check your mail" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/confirm", (req: any, res: any) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.status(400).send({ message: "Incorrect token" });
    }

    const [ivHex, encryptedEmail] = token.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(
      "aes-128-cbc",
      Buffer.from("f2a6e85f66ad1b8932d13c3835591256", "hex"),
      iv
    );

    let decryptedData = decipher.update(encryptedEmail, "hex", "utf-8");
    decryptedData += decipher.final("utf-8");

    const { email } = JSON.parse(decryptedData);
    if (!email) {
      return res.status(400).send({ message: "Invalid Token" });
    }

    return res
      .status(200)
      .send({ message: "Successfully Confirmed the Information", ind: true });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});
router.post("/signup", async (req: any, res: any) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      const missingFields = [];
      if (!email) missingFields.push("Email is required");
      if (!username) missingFields.push("Username is required");
      if (!password) missingFields.push("Password is required");

      return res.status(400).send({
        message: missingFields.join("\n"),
      });
    }
    const hashPassword = await bcrypt.hash(password, 10).catch((err: any) => {
      return res.status(500).send({ message: err.message });
    });
    const userInfo = await user({
      email,
      username,
      password: hashPassword,
      clientID: crypto.randomBytes(32).toString("hex"),
      clientSecret: crypto.randomBytes(32).toString("hex"),
    }).save();
    if (!userInfo) {
      return res.status(400).send({ message: "Something went wrong" });
    }
    return res.status(200).send({ message: "Successfully account is created" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req: any, res: any, next: any) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email Address is  required" });
    }
    if (!password) {
      return res.status(400).send({ message: "Password is required" });
    }
    const userInfo = await user.findOne({ email: email });
    if (!userInfo) {
      return res
        .status(401)
        .send({ message: "Your email address is incorrect" });
    }
    if (bcrypt.compare(password, userInfo.password) == false) {
      return res.status(401).send({ message: "Your password is incorrect" });
    }
    passport.use(
      new OAuthStrategy(
        {
          authorizationURL: `${process.env.proxy}/auth?email=${userInfo.email}`,
          tokenURL: `${process.env.proxy}/auth/token`,
          clientID: userInfo.clientID,
          clientSecret: userInfo.clientSecret,
          callbackURL: `${process.env.proxy}/auth/callback`,
        },
        (accessToken: any, refreshToken: any, profile: any, done: any) => {
          console.log(done);
          done(null, profile);
        }
      )
    );
    passport.authenticate("oauth2")(req, res, next);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});
passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  done(null);
});
router.get("/", async (req: any, res: any) => {
  try {
    const { email, client_id, redirect_uri } = req.query;
    if (!email) {
      return res.status(400).send({ message: "Email Address is missing" });
    }
    if (!client_id) {
      return res.status(400).send({ message: "Client ID is missing" });
    }
    const accessToken = await jwt.sign(
      { clientId: client_id, email: email },
      process.env.key
    );
    const oauthToken = await jwt.sign(
      { clientID: client_id, email: email, accessToken: accessToken },
      process.env.key
    );
    await user.updateOne({ email }, { $push: { token: oauthToken } });
    res.redirect(`${redirect_uri}?token=${oauthToken}`);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/callback", (req: any, res: any) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).send({ message: "Invalid token is generated" });
    }
    return res
      .status(200)
      .send({ token: token, message: "Successfully login" });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

export {};
module.exports = router;
