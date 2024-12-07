/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - role
 *       properties:
 *         id:
 *           type: number
 *           description: id for the user
 *         username:
 *           type: string
 *           description: Username of the user
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *         password:
 *           type: string
 *           description: Password of the user
 *         role:
 *           type: string
 *           description: Role of the user ( admin, lecturer or student)
 */
import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *  get:
 *      summary: Get all users
 *      responses:
 *          200:
 *              description: A list of users
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/User'
 */
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

userRouter.put(
    '/:userId/groups/:groupId',
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.params.userId);
            const groupId = parseInt(req.params.groupId);
            const user = await userService.addGroupToUser(userId, groupId);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }
);

userRouter.get('/group/:groupId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const groupId = parseInt(req.params.groupId, 10);
        if (isNaN(groupId)) {
            return res.status(400).json({ error: 'Invalid groupId provided' });
        }

        const users = await userService.getUsersByGroupId(groupId);
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
});

export { userRouter };
