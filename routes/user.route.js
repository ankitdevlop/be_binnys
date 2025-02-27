const express = require('express');
const router = express.Router();
const userController = require('../controller/users');

const { celebrate, Joi } = require('celebrate');
const jwtTokenVerify = require('../middleware/jwtTokenVerify');



router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/refreshTokenApi", userController.refreshTokenApi);
router.get("/getUserInfo", jwtTokenVerify.authMiddleware,userController.getUserInfo);


module.exports = router;
