
const moment = require('moment');
const md5 = require('md5');
const userModel = require("../model/userModel");

var dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken');
module.exports = {
    signup: async (req, res) => {
        try {
            const { username, password } = req.body;
            // if(name||email||password){
            //     return res.status(400).json({ error: "all fields are mandatory" })
            // }
            // console.log('req', req.body)
            let user = await userModel.findOne({ username });
            if (user) return res.status(400).json({ error: "User already exists" });

            const hashedPassword = await md5(password);

            user = new userModel({ username, password: hashedPassword });
            await user.save();
            const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });

            res.status(201).json({ message: "User registered successfully", token: token });
        } catch (error) {
            console.log('error', error)

            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    login: async (req, res) => {
        try {
            const { username, password } = req.body;
            const user = await userModel.findOne({ username });
            if (!user) return res.status(400).json({ error: "User not found" });

            const isMatch = md5(password) === user.password;
            if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.json({ token });
        } catch (error) {
            console.log('error', error)
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    refreshTokenApi: async (req, res) => {
        const token =
            req.headers.authorization?.split(' ')[1] ||
            req.query.token ||
            req.body.token;

        if (!token) {
            return res.status(400).json({ error: 'Token is required' });
        }

        try {
            jwt.verify(token, process.env.JWT_SECRET);
            return res.status(200).json({ message: 'Token is still valid' });
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                try {
                    const decoded = jwt.decode(token);
                    if (!decoded) {
                        return res.status(401).json({ error: 'Invalid token' });
                    }
                    const newToken = jwt.sign(
                        { userId: decoded.userId, email: decoded.email },
                        process.env.JWT_SECRET,
                        { expiresIn: '60s' }
                    );
                    res.setHeader('Authorization', `Bearer ${newToken}`);
                    return res.status(200).json({
                        message: 'Token refreshed successfully',
                        token: newToken,
                    });
                } catch (refreshError) {
                    return res.status(500).json({ error: 'Error generating new token' });
                }
            } else {
                return res.status(401).json({ error: 'Invalid token' });
            }
        }
    },
    getUserInfo: async (req, res) => {
        console.log(req.user)
        const userIdToFecth = req.user.id;
        try {
            const user = await userModel.findById(userIdToFecth).select('-password'); // Exclude password
            if (!user) return res.status(404).json({ message: "User not found" });

            res.json(user);
        } catch (error) {
            res.status(500).json({ message: 'Server Error' });
        }
    }


};