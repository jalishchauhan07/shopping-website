const jwt = require("jsonwebtoken");
const user = require("../model/user");

const checkAuthenticate = (req: any, res: any, next: any) => {
  try {
    const token = req.header["authorization"].split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "UnAuthorize User" });
    }
    const tokenInfo = jwt.verify(token, process.env.key);
    const userInfo = user.findOne({ email: tokenInfo.email });
    if (!userInfo) {
      return res.status(401).send({ message: "UnAuthorize User" });
    }
    next();
  } catch (err) {
    return res.status(500).send({ message: "Internal Server Error" });
  }
};
export {};
module.exports = checkAuthenticate;
