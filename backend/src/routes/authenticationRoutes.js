import express from "express"
import { createAccount, login, logout ,createServiceProvider} from "../controllers/loginController.js";

const router =express.Router();

//handling the requests

//login route
router.post("/login",login)

//create account route
router.post("/register",createAccount)

//logout route
router.post("/logout",logout)

//create service provider account route
router.post("/register/provider",createServiceProvider)


export default router;