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
 *   get:
 *     summary: Get all groups
 *     description: Retrieve a list of groups
 *     responses:
 *       200:
 *         description: A list of groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 */
groupRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groups = groupService.getAllGroups();
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /groups/{code}/users/{id}:
 *   post:
 *     summary: Add user to group
 *     description: Add a user to a group
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: code of the group
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the user
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: User added to group
 */
groupRouter.post('/:code/users/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code } = req.params;
        const { id } = req.params;
        const group = groupService.addUserToGroup({ code }, { id: parseInt(id) });
        res.status(200).json(group);
    } catch (error) {
        next(error);
    }
});

groupRouter.get('/:code/users', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { code } = req.params;
        const users = groupService.getUsersByGroup(code);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }});

export { groupRouter };
