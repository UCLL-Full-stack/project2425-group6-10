/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Message:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *          id:
 *           type: number
 *           description: id for the message
 *          content:
 *           type: string
 *           description: content of the message
 *          date:
 *           type: string
 *           description: date of the message
 */
import express, { NextFunction, Request, Response } from 'express';
import messageService from '../service/message.service';
import { Role } from '@prisma/client';

const messageRouter = express.Router();

/**
 * @swagger
 * /messages:
 *  get:
 *      security:
 *         - bearerAuth: []
 *      summary: Get all messages
 *      responses:
 *          200:
 *              description: A list of messages
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Message'
 */
messageRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const messages = await messageService.getAllMessages();
        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /messages/group/{groupId}:
 *  get:
 *      security:
 *         - bearerAuth: []
 *      summary: Get messages by group
 *      parameters:
 *          - in: path
 *            name: groupId
 *            required: true
 *            schema:
 *              type: integer
 *            description: The group id
 *      responses:
 *          200:
 *              description: A list of messages
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Message'
 */
messageRouter.get('/group/:groupId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username, role } = request.auth;
        const groupId = parseInt(req.params.groupId);
        const messages = await messageService.getMessagesByGroup(username, groupId, role);
        res.status(200).json(messages);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /messages/send:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Send a message to a group
 *     parameters:
 *       - in: body
 *         name: message
 *         description: The message content and group to send the message to.
 *         schema:
 *           type: object
 *           required:
 *             - groupId
 *             - content
 *           properties:
 *             groupId:
 *               type: integer
 *               description: The ID of the group to send the message to.
 *             content:
 *               type: string
 *               description: The content of the message.
 *     responses:
 *       200:
 *         description: Message successfully sent
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Message'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
messageRouter.post('/send', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const { username } = request.auth;
        const { groupId, content } = req.body;
        const message = await messageService.sendMessage(username, groupId, content);
        res.status(200).json(message);
    } catch (error) {
        next(error);
    }
});
export { messageRouter };
