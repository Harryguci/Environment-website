import { NextFunction, Response, Request } from "express";
import { verify } from "jsonwebtoken";

function validateToken(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.accesstoken;

    if (!accessToken) {
        return res.send({ error: "User not logged in" });
    }
    try {
        const validToken = verify(accessToken, "importantsecret");
        req['user'] = validToken;
        
        if (validToken)
            return next();

    } catch (err) {
        return res.send({ error: err });
    }
}

function generateToken(token: String) {
    const user = verify(token, "importantsecret");

    return user;
}

module.exports = { validateToken, generateToken };
