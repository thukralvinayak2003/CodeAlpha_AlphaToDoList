"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (fn) {
    return function (req, res, next) {
        // It is a promise, so if a promise is rejected, it gives an error, and here we handle that error
        fn(req, res, next).catch(next);
    };
});
//# sourceMappingURL=catchAsync.js.map