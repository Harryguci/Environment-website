const { verify } = require("jsonwebtoken");

function validateToken(req, res, next) {
  const accessToken = req.headers.accesstoken;
  // console.log(req.headers);

  if (!accessToken) {
    return res.send({ error: "User not logged in" });
  }
  try {
    const validToken = verify(accessToken, "importantsecret");
    req.user = validToken;
    // console.log("Valid token: ", JSON.stringify(req.user));
    if (validToken) return next();
  } catch (err) {
    return res.send({ error: err });
  }
}

module.exports = { validateToken };
