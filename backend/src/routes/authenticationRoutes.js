import express from "express"
import { createAccount, login, logout ,createServiceProvider,useCheckLogin} from "../controllers/loginController.js";

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

router.get("/me", useCheckLogin, (req, res) => {
  res.json({
    userId: req.user._id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role,
  });
});



export default router;