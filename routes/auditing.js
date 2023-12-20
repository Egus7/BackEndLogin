import { Router } from 'express';
import { getAuditing, getAuditingById } from '../controllers/auditing.controller.js';

const auditingRouter = Router();
/**
 * @openapi
 * /utnbackend/v1/auditing:
 *   get:
 *     tags:
 *       - Auditing
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array 
 *                   items: 
 *                     type: object
 */
auditingRouter.get('/', getAuditing);
/**
 * @openapi
 * /utnbackend/v1/auditing/{id}:
 *   get:
 *     tags:
 *       - Auditing
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Auditing to search
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 data:
 *                   type: array 
 *                   items: 
 *                     type: object
 * 
 */
auditingRouter.get('/:id', getAuditingById);

export { auditingRouter };
