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
        .withMessage("Password must be at least 8 characters long.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter.")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter.")
        .matches(/[^A-Za-z0-9]/)
        .withMessage("Password must contain at least one special character.")

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
