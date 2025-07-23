import express from "express"
import { createAccount, login, logout } from "../controllers/loginController.js";

const router =express.Router();

//handling the requests

//login route
router.post("/login",login)

//create account route
router.post("/register",createAccount)

//logout route
router.post("/logout",logout)


export default router;