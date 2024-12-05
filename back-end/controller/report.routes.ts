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
 *       properties:
 *          id:
 *           type: number
 *           description: id for the report
 *          content:
 *           type: string
 *           description: description of the report
 *          date:
 *           type: string
 *           description: date of the report
 */
import express, { NextFunction, Request, Response } from 'express';
import reportService from '../service/report.service';

const reportRouter = express.Router();

/**
 * @swagger
 * /reports:
 *  get:
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
        const reports = await reportService.getAllReports();
        res.status(200).json(reports);
    } catch (error) {
        next(error);
    }
});

export { reportRouter };
