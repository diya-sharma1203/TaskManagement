"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET || 'developer_secret_key_123456789_team_task_manager', {
        expiresIn: '30d',
    });
};
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userExists = await User_1.User.findOne({ email });
        if (userExists) {
            res.status(400).json({ message: 'User already exists with this email' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await User_1.User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'member',
        });
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id.toString()),
            });
        }
        else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during registration', error });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.User.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password || '');
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id.toString()),
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error during login', error });
    }
};
exports.loginUser = loginUser;
const getMe = async (req, res) => {
    try {
        if (!req.user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(req.user);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error retrieving profile', error });
    }
};
exports.getMe = getMe;
