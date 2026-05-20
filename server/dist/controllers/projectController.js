"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.updateProject = exports.getProjectById = exports.createProject = exports.getProjects = void 0;
const Project_1 = require("../models/Project");
const Task_1 = require("../models/Task");
const getProjects = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        let projects;
        if (req.user.role === 'admin') {
            projects = await Project_1.Project.find({}).populate('createdBy', 'name email').populate('members', 'name email role');
        }
        else {
            projects = await Project_1.Project.find({
                $or: [
                    { createdBy: req.user._id },
                    { members: req.user._id },
                ],
            }).populate('createdBy', 'name email').populate('members', 'name email role');
        }
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error retrieving projects', error });
    }
};
exports.getProjects = getProjects;
const createProject = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        const { title, description, members, status } = req.body;
        const project = await Project_1.Project.create({
            title,
            description,
            createdBy: req.user._id,
            members: members || [],
            status: status || 'active',
        });
        const populatedProject = await Project_1.Project.findById(project._id)
            .populate('createdBy', 'name email')
            .populate('members', 'name email role');
        res.status(201).json(populatedProject);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error creating project', error });
    }
};
exports.createProject = createProject;
const getProjectById = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        const project = await Project_1.Project.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('members', 'name email role');
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        if (req.user.role !== 'admin' &&
            project.createdBy.toString() !== req.user._id.toString() &&
            !project.members.some((m) => m._id.toString() === req.user?._id.toString())) {
            res.status(403).json({ message: 'Access denied to this project' });
            return;
        }
        res.json(project);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error retrieving project details', error });
    }
};
exports.getProjectById = getProjectById;
const updateProject = async (req, res) => {
    try {
        const { title, description, members, status } = req.body;
        const project = await Project_1.Project.findById(req.params.id);
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        project.title = title || project.title;
        project.description = description || project.description;
        project.members = members || project.members;
        project.status = status || project.status;
        await project.save();
        const populatedProject = await Project_1.Project.findById(project._id)
            .populate('createdBy', 'name email')
            .populate('members', 'name email role');
        res.json(populatedProject);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error updating project', error });
    }
};
exports.updateProject = updateProject;
const deleteProject = async (req, res) => {
    try {
        const project = await Project_1.Project.findById(req.params.id);
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        await Project_1.Project.findByIdAndDelete(req.params.id);
        await Task_1.Task.deleteMany({ project: req.params.id });
        res.json({ message: 'Project and all associated tasks deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error deleting project', error });
    }
};
exports.deleteProject = deleteProject;
