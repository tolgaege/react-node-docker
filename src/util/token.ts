import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const createToken = function(auth: any) {
    return jwt.sign({
            id: auth.id
        }, process.env.SESSION_SECRET,
        {
            expiresIn: 60 * 120
        });
};

export const generateToken = function(req: any, res: Response, next: NextFunction) {
    req.token = createToken(req.auth);
    return next();
};

export const sendToken = function(req: any, res: Response) {
    res.setHeader("x-auth-token", req.token);
    return res.status(200).send(JSON.stringify(req.user));
};


