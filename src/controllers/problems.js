const { Problem, Tag, Comment, User } = require('../models');
const { NotFoundError, BadRequestError } = require('../errors');

const getAllProblems = async (req, res, next) => {
  try {
    const { difficulty, tags, search, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    const where = {};
    if (difficulty) where.difficulty = difficulty;
    if (search) where.title = { [Op.iLike]: `%${search}%` };
    
    const include = [];
    if (tags) {
      include.push({
        model: Tag,
        where: { name: { [Op.in]: tags.split(',') } },
        through: { attributes: [] }
      });
    }
    
    const problems = await Problem.findAndCountAll({
      where,
      include,
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      total: problems.count,
      page: parseInt(page),
      pages: Math.ceil(problems.count / limit),
      data: problems.rows
    });
  } catch (error) {
    next(error);
  }
};

const getProblemById = async (req, res, next) => {
  try {
    const problem = await Problem.findByPk(req.params.id, {
      include: [
        { model: Tag, through: { attributes: [] } },
        { 
          model: Comment,
          include: [{ model: User, attributes: ['id', 'username'] }]
        }
      ]
    });
    
    if (!problem) {
      throw new NotFoundError('Problem not found');
    }
    
    res.json(problem);
  } catch (error) {
    next(error);
  }
};

const createProblem = async (req, res, next) => {
  try {
    const { title, description, difficulty, testCases, constraints, examples, hints, tags } = req.body;
    
    const problem = await Problem.create({
      title,
      description,
      difficulty,
      testCases,
      constraints,
      examples,
      hints,
      userId: req.user.userId
    });
    
    if (tags && tags.length) {
      const tagRecords = await Tag.findAll({ where: { name: tags } });
      await problem.setTags(tagRecords);
    }
    
    res.status(201).json(problem);
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findByPk(req.params.id);
    
    if (!problem) {
      throw new NotFoundError('Problem not found');
    }
    
    if (problem.userId !== req.user.userId && req.user.role !== 'admin') {
      throw new ForbiddenError('Not authorized to update this problem');
    }
    
    const { title, description, difficulty, testCases, constraints, examples, hints, tags } = req.body;
    
    await problem.update({
      title: title || problem.title,
      description: description || problem.description,
      difficulty: difficulty || problem.difficulty,
      testCases: testCases || problem.testCases,
      constraints: constraints || problem.constraints,
      examples: examples || problem.examples,
      hints: hints || problem.hints
    });
    
    if (tags) {
      const tagRecords = await Tag.findAll({ where: { name: tags } });
      await problem.setTags(tagRecords);
    }
    
    res.json(problem);
  } catch (error) {
    next(error);
  }
};

const deleteProblem = async (req, res, next) => {
  try {
    const problem = await Problem.findByPk(req.params.id);
    
    if (!problem) {
      throw new NotFoundError('Problem not found');
    }
    
    if (problem.userId !== req.user.userId && req.user.role !== 'admin') {
      throw new ForbiddenError('Not authorized to delete this problem');
    }
    
    await problem.destroy();
    res.json({ message: 'Problem deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProblems,
  getProblemById,
  createProblem,
  updateProblem,
  deleteProblem
};