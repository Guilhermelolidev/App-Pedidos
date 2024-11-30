import { Request, Response } from 'express';

import { Category } from '../../models/Category';

export async function createCategory(req: Request, res: Response) {
  try {
    const category = await Category.create(req.body);

    res.status(201).json(category);
  } catch {
    res.sendStatus(500);
  }
}
