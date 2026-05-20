import { Response } from 'express';
import { Project } from '../models/Project';
import { Task } from '../models/Task';
import { AuthRequest } from '../middleware/auth';

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User context not found' });
      return;
    }

    let projects;
    if (req.user.role === 'admin') {
      projects = await Project.find({}).populate('createdBy', 'name email').populate('members', 'name email role');
    } else {
      projects = await Project.find({
        $or: [
          { createdBy: req.user._id },
          { members: req.user._id },
        ],
      }).populate('createdBy', 'name email').populate('members', 'name email role');
    }

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving projects', error });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User context not found' });
      return;
    }

    const { title, description, members, status } = req.body;

    const project = await Project.create({
      title,
      description,
      createdBy: req.user._id,
      members: members || [],
      status: status || 'active',
    });

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email role');

    res.status(201).json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating project', error });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'User context not found' });
      return;
    }

    const project = await Project.findById(req.params.id)
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
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving project details', error });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, members, status } = req.body;

    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.members = members || project.members;
    project.status = status || project.status;

    await project.save();

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email')
      .populate('members', 'name email role');

    res.json(populatedProject);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating project', error });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    await Project.findByIdAndDelete(req.params.id);
    await Task.deleteMany({ project: req.params.id });

    res.json({ message: 'Project and all associated tasks deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting project', error });
  }
};
