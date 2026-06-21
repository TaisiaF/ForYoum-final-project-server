import { body } from "express-validator";

export const registerValidation = [

    body("username")
        .trim()
        .isLength({ min: 2 })
        .withMessage(
            "Username must be at least 2 characters"
        ),

    body("email")
        .isEmail()
        .withMessage(
            "Valid email required"
        ),

    body("password")
        .isLength({ min: 8 })
        .withMessage(
            "Password must be at least 8 characters"
        )

];

export const loginValidation = [

    body("username")
        .notEmpty()
        .withMessage(
            "Username is required"
        ),

    body("password")
        .notEmpty()
        .withMessage(
            "Password is required"
        )

];
