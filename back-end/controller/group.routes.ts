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

/**
 * @swagger
 * /groups/{groupId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get group by ID
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the group
 *     responses:
 *       200:
 *         description: The group details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Group'
 *       401:
 *         description: Unauthorized error
 *       404:
 *         description: Group not found
 */
groupRouter.get(
    '/:groupId',
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const groupId = parseInt(req.params.groupId, 10);
  
        if (isNaN(groupId)) {
          return res.status(400).json({ error: 'Invalid group ID' });
        }
  
        const group = await groupService.getGroupById(groupId);
  
        if (!group) {
          return res.status(404).json({ error: 'Group not found' });
        }
  
        res.status(200).json(group);
      } catch (error) {
        next(error);
      }
    }
  );  

export { groupRouter };
