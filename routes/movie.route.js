const express = require('express');
const router = express.Router();
const moviesController = require('../controller/movies');
const {authMiddleware,adminMiddleware}=require("../middleware/jwtTokenVerify")


router.post("/Addmovies" ,authMiddleware,adminMiddleware,  moviesController.Addmovies);
router.get("/getAllMovies" ,authMiddleware,  moviesController.getAllMovies);
router.get("/getMoviesById" ,authMiddleware,  moviesController.getMoviesById);
router.put("/updateMovies" ,authMiddleware,  moviesController.updateMovies);
router.delete("/deleteMovies" ,authMiddleware,  moviesController.deleteMovies);


module.exports = router;
