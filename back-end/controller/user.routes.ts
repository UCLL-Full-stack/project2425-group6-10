/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      required:
 *        - username
 *        - email
 *        - password
 *        - role
 *      properties:
 *        id:
 *          type: number
 *          description: id for the user
 *        username:
 *          type: string
 *          description: Username of the user
 *        email:
 *          type: string
 *          format: email
 *          description: Email address of the user
 *        password:
 *          type: string
 *          description: Password of the user
 *        role:
 *          type: string
 *          description: Role of the user (admin, lecturer, or student)
 *        groups:
 *          type: array
 *          items:
 *            $ref: '#/components/schemas/Group'
 *    Group:
 *      type: object
 *      required:
 *        - name
 *        - description
 *      properties:
 *        id:
 *          type: number
 *          description: id for group
 *        name:
 *          type: string
 *          description: name of the group
 *        description:
 *          type: string
 *          description: description of the group
 *        code:
 *          type: string
 *          description: code of the group
 */
import express, { NextFunction, Request, Response } from 'express';
import userService from '../service/user.service';
import { User } from '@prisma/client';
import { UserInput } from '../types';

const userRouter = express.Router();

/**
 * @swagger
 * /users:
 *  get:
 *      security:
 *      - bearerAuth: []
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

/**
 * @swagger
 * /users/{userId}/groups/{groupId}:
 *  put:
 *      security:
 *      - bearerAuth: []
 *      summary: Add a user to a group
 *      parameters:
 *          - in: path
 *            name: userId
 *            required: true
 *            description: Id of the user
 *            schema:
 *              type: integer
 *          - in: path
 *            name: groupId
 *            required: true
 *            description: Id of the group
 *            schema:
 *              type: integer
 *      responses:
 *          200:
 *              description: A user object after group assignment
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 *          400:
 *              description: Invalid userId or groupId
 *          404:
 *              description: User or group not found
 */
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

/**
 * @swagger
 * /users/group/{groupId}:
 *  get:
 *      security:
 *       - bearerAuth: []
 *      summary: Get users by group id
 *      parameters:
 *          - in: path
 *            name: groupId
 *            required: true
 *            description: Id of the group
 *            schema:
 *              type: integer
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

/**
 * @swagger
 * /users/signup:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      summary: Create a new user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          201:
 *              description: A user object
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/User'
 */
userRouter.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const UserInput = <UserInput>req.body;
        const user = await userService.createUser(UserInput);
        return res.status(201).json(user);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /users/login:
 *  post:
 *      security:
 *        - bearerAuth: []
 *      summary: Authenticate user
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          username:
 *                              type: string
 *                          password:
 *                              type: string
 *      responses:
 *          200:
 *              description: A user object
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                              token:
 *                                  type: string
 *                              username:
 *                                  type: string
 *                              role:
 *                                  type: string
 */
userRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userInput: UserInput = req.body;
        const response = await userService.authenticate(userInput);
        res.status(200).json({ message: 'Authentication successful', ...response });
    } catch (error) {
        next(error);
    }
});
export { userRouter };
