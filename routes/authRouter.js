import express from "express";

import authController
    from "../controllers/authController.js";

import validationMiddleware
    from "../middleware/validationMiddleware.js";

import {
    registerValidation,
    loginValidation
} from "../middleware/authValidators.js";

import asyncHandler
    from "../middleware/asyncHandler.js";

const router = express.Router();

router.post(
    "/register",
    registerValidation,
    validationMiddleware,
    asyncHandler(
        authController.register
    )
);

router.post(
    "/login",
    loginValidation,
    validationMiddleware,
    asyncHandler(
        authController.login
    )
);

export default router;
