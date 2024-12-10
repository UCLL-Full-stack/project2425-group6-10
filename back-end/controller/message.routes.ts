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

export { messageRouter };
