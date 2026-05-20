"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksByProject = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const Task_1 = require("../models/Task");
const Project_1 = require("../models/Project");
const getTasks = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        let tasks;
        if (req.user.role === 'admin') {
            tasks = await Task_1.Task.find({})
                .populate('assignedTo', 'name email role')
                .populate('project', 'title')
                .populate('createdBy', 'name email');
        }
        else {
            tasks = await Task_1.Task.find({ assignedTo: req.user._id })
                .populate('assignedTo', 'name email role')
                .populate('project', 'title')
                .populate('createdBy', 'name email');
        }
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error retrieving tasks', error });
    }
};
exports.getTasks = getTasks;
const createTask = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        const { title, description, priority, status, dueDate, assignedTo, project } = req.body;
        const projectExists = await Project_1.Project.findById(project);
        if (!projectExists) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        const task = await Task_1.Task.create({
            title,
            description,
            priority: priority || 'medium',
            status: status || 'todo',
            dueDate,
            assignedTo,
            project,
            createdBy: req.user._id,
        });
        const populatedTask = await Task_1.Task.findById(task._id)
            .populate('assignedTo', 'name email role')
            .populate('project', 'title')
            .populate('createdBy', 'name email');
        res.status(201).json(populatedTask);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error creating task', error });
    }
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        const task = await Task_1.Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        if (req.user.role === 'admin') {
            const { title, description, priority, status, dueDate, assignedTo, project } = req.body;
            task.title = title !== undefined ? title : task.title;
            task.description = description !== undefined ? description : task.description;
            task.priority = priority !== undefined ? priority : task.priority;
            task.status = status !== undefined ? status : task.status;
            task.dueDate = dueDate !== undefined ? new Date(dueDate) : task.dueDate;
            task.assignedTo = assignedTo !== undefined ? assignedTo : task.assignedTo;
            if (project !== undefined) {
                const projectExists = await Project_1.Project.findById(project);
                if (!projectExists) {
                    res.status(404).json({ message: 'Associated project not found' });
                    return;
                }
                task.project = project;
            }
        }
        else {
            if (task.assignedTo.toString() !== req.user._id.toString()) {
                res.status(403).json({ message: 'Access denied: You can only update tasks assigned to you' });
                return;
            }
            const { status } = req.body;
            if (status === undefined) {
                res.status(400).json({ message: 'Members can only update task status' });
                return;
            }
            task.status = status;
        }
        await task.save();
        const populatedTask = await Task_1.Task.findById(task._id)
            .populate('assignedTo', 'name email role')
            .populate('project', 'title')
            .populate('createdBy', 'name email');
        res.json(populatedTask);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error updating task', error });
    }
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    try {
        const task = await Task_1.Task.findById(req.params.id);
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        await Task_1.Task.findByIdAndDelete(req.params.id);
        res.json({ message: 'Task deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error deleting task', error });
    }
};
exports.deleteTask = deleteTask;
const getTasksByProject = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: 'User context not found' });
            return;
        }
        const { projectId } = req.params;
        const project = await Project_1.Project.findById(projectId);
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        if (req.user.role !== 'admin' &&
            project.createdBy.toString() !== req.user._id.toString() &&
            !project.members.some((m) => m._id.toString() === req.user?._id.toString())) {
            res.status(403).json({ message: 'Access denied to this project tasks' });
            return;
        }
        const tasks = await Task_1.Task.find({ project: projectId })
            .populate('assignedTo', 'name email role')
            .populate('project', 'title')
            .populate('createdBy', 'name email');
        res.json(tasks);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error retrieving project tasks', error });
    }
};
exports.getTasksByProject = getTasksByProject;
