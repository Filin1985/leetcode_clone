import db from "../models/index.js";
import Tag from "../models/index.js";
import Problem from "../models/index.js";
import {NotFoundError, BadRequestError} from "../errors/index.js";
import type {Request, Response, NextFunction} from 'express';

interface TagAttributes {
  id: number;
  name: string;
  problemCount?: number;
}

interface ProblemAttributes {
  id: number;
  title: string;
  isActive: boolean;
}

const getAllTags = async (req: Request, res: Response<TagAttributes[]>, next: NextFunction) => {
  try {
    const tags = await Tag.findAll({
      include: [{
        model: Problem,
        attributes: [],
        through: {attributes: []},
      }],
      attributes: [
        "id",
        "name",
        [db.fn("COUNT", db.col("Problems.id")), "problemCount"],
      ],
      group: ["Tag.id"],
      order: [[db.literal("problemCount"), "DESC"]],
    });

    res.json(tags);
  } catch (error: unknown) {
    next(error);
  }
};

const createTag = async (req: Request, res: Response<TagAttributes>, next: NextFunction) => {
  try {
    const {name} = req.body;

    if (!name) {
      throw new BadRequestError("Tag name is required");
    }

    const tag = await Tag.create({name});
    res.status(201).json(tag);
  } catch (error: unknown) {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      (error as {name: string;}).name === "SequelizeUniqueConstraintError"
    ) {
      next(new BadRequestError("Tag already exists"));
    } else {
      next(error);
    }
  }
};

const updateTag = async (req: Request, res: Response<TagAttributes>, next: NextFunction) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      throw new NotFoundError("Tag not found");
    }

    const {name} = req.body;
    await tag.update({name});
    res.json(tag);
  } catch (error: unknown) {
    next(error);
  }
};

const deleteTag = async (req: Request, res: Response<{message: string;}>, next: NextFunction) => {
  try {
    const tag = await Tag.findByPk(req.params.id);
    if (!tag) {
      throw new NotFoundError("Tag not found");
    }

    await tag.destroy();
    res.json({message: "Tag deleted successfully"});
  } catch (error: unknown) {
    next(error);
  }
};

const getProblemsByTag = async (req: Request, res: Response<ProblemAttributes[]>, next: NextFunction) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{
        model: Problem,
        through: {attributes: []},
        where: {isActive: true},
      }],
    });

    if (!tag) {
      throw new NotFoundError("Tag not found");
    }

    res.json(tag.Problems);
  } catch (error: unknown) {
    next(error);
  }
};

export {
  getAllTags,
  createTag,
  updateTag,
  deleteTag,
  getProblemsByTag
};
