
const moment = require('moment');
var dotenv = require('dotenv').config()
const movieModel = require('../model/movieModel');
const moviesData = require('../moviesDat');




module.exports = {
    getAllMovies:async (req, res) => {
      try {
          const {
              search,
              category,
              startDate,
              endDate,
              sortBy = "title",
              order = "asc",
              page = 1,
              limit = 10
          } = req.query;
  
          // Construct filter conditions
          let query = {};
          if (search) query.title = new RegExp(search, "i");
          if (category) query.category = category;
          if (startDate || endDate) {
              query.releaseDate = {};
              if (startDate) query.releaseDate.$gte = new Date(startDate);
              if (endDate) query.releaseDate.$lte = new Date(endDate);
          }
  
          // Sorting options
          const sortOptions = sortBy === "rating" 
              ? { rating: order === "asc" ? 1 : -1 } 
              : { title: order === "asc" ? 1 : -1 };
  
          // Fetch movies with filters, sorting, and pagination
          const movies = await movieModel
              .find(query)
              .sort(sortOptions)
              .skip((page - 1) * limit)
              .limit(parseInt(limit));
  
          // Total movies count
          const totalMovies = await movieModel.countDocuments(query);
  
          // Send response
          res.json({
              message: "Movies fetched successfully",
              totalMovies,
              totalPages: Math.ceil(totalMovies / limit),
              currentPage: Number(page),
              movies
          });
  
      } catch (error) {
          console.error("Error fetching movies:", error);
          res.status(500).json({ error: "Internal Server Error" });
      }
  },

    Addmovies: async (req, res) => {
        try {
            const { title, description, rating, releaseDate, duration } = req.body;
            const newMovie = new movieModel({ title, description, rating, releaseDate, duration });
            await newMovie.save();
            res.json({ message: "Movie added" });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },

    getMoviesById: async (req, res) => {
        try {
          const { _id } = req.query;

            const movie = await movieModel.findById(_id);
            if (!movie) return res.status(404).json({ error: "Movie not found" });
            res.json(movie);
        } catch (error) {
            console.error("Error fetching movie by ID:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
      
    updateMovies: async (req, res) => {
        try {
          const { _id } = req.query;

            const movie = await movieModel.findByIdAndUpdate(_id, req.body, { new: true });
            if (!movie) return res.status(404).json({ error: "Movie not found" });
            res.json({ message: "Movie updated", movie });
          } catch (error) {
            console.error("Error updating movie:", error);
            res.status(500).json({ error: "Internal Server Error" });
          }
    },
    deleteMovies: async (req, res) => {
        try {
          const { _id } = req.query;
            const movie = await movieModel.findByIdAndDelete(_id);
            if (!movie) return res.status(404).json({ error: "Movie not found" });
            res.json({ message: "Movie deleted" });
          } catch (error) {
            console.error("Error deleting movie:", error);
            res.status(500).json({ error: "Internal Server Error" });
          }
    },

};