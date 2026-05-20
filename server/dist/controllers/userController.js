"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamMembers = void 0;
const User_1 = require("../models/User");
const getTeamMembers = async (req, res) => {
    try {
        const team = await User_1.User.find({}).select('-password');
        res.json(team);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error retrieving team members', error });
    }
};
exports.getTeamMembers = getTeamMembers;
