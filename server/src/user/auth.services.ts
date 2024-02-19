import * as jwt from "jsonwebtoken";
import { createHmac } from "crypto";
import { db, xprisma } from "../utils/db.server";
import { NextFunction, Response, Request } from "express";
import type { JwtPayload } from "jsonwebtoken";
import { getUser } from "./user.services";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export interface GetUserAuthInfoRequest extends Request {
  user?: User; // or any other type
}

const generateToken = (user: User) => {
  const pass = process.env.JWT_ACCESS_SECRET;
  if (pass) {
    return jwt.sign({ id: user.id }, pass, {
      expiresIn: "90d",
    });
  }
};

export function hashToken(token: string) {
  if (process.env.SECRECT) {
    return createHmac("sha512", process.env.SECRECT)
      .update(token)
      .digest("hex");
  }
}

export const createSendToken = (
  user: User,
  statusCode: number,
  response: Response
) => {
  try {
    const token = generateToken(user);

    const cookieOptions = {
      //IN js to specify date we use new Date
      maxage: Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
      httpOnly: true, // SO the cookie cannot be accessed or modified by the browser
    };

    response.cookie("JWT", token, cookieOptions);

    response.status(statusCode).json({
      status: "success",
      token: token,
      data: {
        user: user,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const isLoggedIn = async (
  request: GetUserAuthInfoRequest,
  response: Response,
  next: NextFunction
) => {
  try {
    let token;
    if (
      request.headers.authorization &&
      request.headers.authorization.startsWith("Bearer")
    ) {
      token = request.headers.authorization.split(" ")[1]; // the token cannot be declared inside the block as it scope will only remain inside the block
    } else if (request.cookies.JWT) {
      token = request.cookies.JWT;
    }
    // console.log(request.cookies.JWT);
    if (token && process.env.JWT_ACCESS_SECRET) {
      const decode = await verifyJwt(
        // request.cookies.jwt
        token,
        process.env.JWT_ACCESS_SECRET
      );

      const currentUser = await getUser((decode as any).id);
      // console.log(currentUser);
      if (!currentUser) {
        return next();
      }

      request.user = currentUser;

      response.locals.user = currentUser; //it will create a user variable avaliable for all pug templates
      return next();
    }
  } catch (error) {
    return next();
  }

  next();
};

export const verifyJwt = (
  token: string,
  secretOrPublicKey: jwt.Secret
): Promise<Object> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded || {});
      }
    });
  });
};



