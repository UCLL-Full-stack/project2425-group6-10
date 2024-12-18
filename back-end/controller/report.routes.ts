/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Report:
 *       type: object
 *       required:
 *         - description
 *         - userId
 *         - messageId
 *       properties:
 *         id:
 *           type: number
 *           description: ID of the report
 *         description:
 *           type: string
 *           description: Description of the report
 *         date:
 *           type: string
 *           description: Date when the report was created
 *         userId:
 *           type: number
 *           description: ID of the user who created the report
 *         messageId:
 *           type: number
 *           description: ID of the reported message
 */
import express, { NextFunction, Request, Response } from 'express';
import reportService from '../service/report.service';
import { Role } from '../types';

const reportRouter = express.Router();

/**
 * @swagger
 * /reports:
 *  get:
 *      security:
 *          - bearerAuth: []
 *      summary: Get all reports
 *      responses:
 *          200:
 *              description: A list of reports
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Report'
 */
reportRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string; role: Role } };
        const reports = await reportService.getAllReports(request.auth.role);
        res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
});

/**
 * @swagger
 * /reports:
 *  post:
 *      security:
 *          - bearerAuth: []
 *      summary: Create a report
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - description
 *                          - messageId
 *                      properties:
 *                          description:
 *                              type: string
 *                          messageId:
 *                              type: number
 *      responses:
 *          201:
 *              description: The created report
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Report'
 */
reportRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const request = req as Request & { auth: { username: string } };
        const username = request.auth.username;

        const { description, messageId } = req.body;

        if (!username) {
            return res.status(401).json({ error: 'Unauthorized: User is not authenticated' });
        }

        const report = await reportService.createReport(username, messageId, description);
        res.status(201).json(report);
    } catch (error) {
        next(error);
    }
});

export { reportRouter };
