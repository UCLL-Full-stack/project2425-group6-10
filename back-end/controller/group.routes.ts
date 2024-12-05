/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Group:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *          id:
 *           type: number
 *           description: id for group
 *          name:
 *           type: string
 *           description: name of the group
 *          description:
 *           type: string
 *           description: description of the group
 *          code:
 *           type: string
 *           description: code of the group
 */
import express, { NextFunction, Request, Response } from 'express';
import groupService from '../service/group.service';

const groupRouter = express.Router();

/**
 * @swagger
 * /groups:
 *  get:
 *      summary: Get all groups
 *      responses:
 *          200:
 *              description: A list of groups
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Group'
 */
groupRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groups = await groupService.getAllGroups();
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
});

export { groupRouter };
