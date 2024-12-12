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
import { Role } from '../types';

const groupRouter = express.Router();

/**
 * @swagger
 * /groups:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get groups based on user role
 *     responses:
 *       200:
 *         description: A list of groups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Group'
 *       401:
 *         description: Unauthorized error
 */
groupRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;

        const groups = await groupService.getGroups(username, role);
        res.status(200).json(groups);
    } catch (error) {
        next(error);
    }
});

export { groupRouter };
