"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.isLoggedIn = exports.createSendToken = exports.hashToken = void 0;
var jwt = __importStar(require("jsonwebtoken"));
var crypto_1 = require("crypto");
var user_services_1 = require("./user.services");
var generateToken = function (user) {
    var pass = process.env.JWT_ACCESS_SECRET;
    if (pass) {
        return jwt.sign({ id: user.id }, pass, {
            expiresIn: "90d",
        });
    }
};
function hashToken(token) {
    if (process.env.SECRECT) {
        return (0, crypto_1.createHmac)("sha512", process.env.SECRECT)
            .update(token)
            .digest("hex");
    }
}
exports.hashToken = hashToken;
var createSendToken = function (user, statusCode, response) {
    var token = generateToken(user);
    // const cookieOptions = {
    //   //IN js to specify date we use new Date
    //   expires: new Date(
    //     Date.now() +
    //       Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    //   ),
    //   httpOnly: true, // SO the cookie cannot be accessed or modified by the browser
    // };
    // response.cookie("JWT", token, cookieOptions);
    response.status(statusCode).json({
        status: "success",
        token: token,
        data: {
            user: user,
        },
    });
};
exports.createSendToken = createSendToken;
var isLoggedIn = function (request, response, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decode, currentUser, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                token = void 0;
                if (request.headers.authorization &&
                    request.headers.authorization.startsWith("Bearer")) {
                    token = request.headers.authorization.split(" ")[1]; // the token cannot be declared inside the block as it scope will only remain inside the block
                }
                else if (request.cookies.JWT) {
                    token = request.cookies.JWT;
                }
                if (!(token && process.env.JWT_ACCESS_SECRET)) return [3 /*break*/, 3];
                return [4 /*yield*/, (0, exports.verifyJwt)(
                    // request.cookies.jwt
                    token, process.env.JWT_ACCESS_SECRET)];
            case 1:
                decode = _a.sent();
                return [4 /*yield*/, (0, user_services_1.getUser)(decode.id)];
            case 2:
                currentUser = _a.sent();
                console.log(currentUser);
                if (!currentUser) {
                    return [2 /*return*/, next()];
                }
                request.user = currentUser;
                response.locals.user = currentUser; //it will create a user variable avaliable for all pug templates
                return [2 /*return*/, next()];
            case 3: return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                return [2 /*return*/, next()];
            case 5:
                next();
                return [2 /*return*/];
        }
    });
}); };
exports.isLoggedIn = isLoggedIn;
var verifyJwt = function (token, secretOrPublicKey) {
    return new Promise(function (resolve, reject) {
        jwt.verify(token, secretOrPublicKey, function (err, decoded) {
            if (err) {
                reject(err);
            }
            else {
                resolve(decoded || {});
            }
        });
    });
};
exports.verifyJwt = verifyJwt;
//# sourceMappingURL=auth.services.js.map