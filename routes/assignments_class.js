import { Router } from 'express';
import { getAssignmentsClass, getAssignmentsClassById, createAssignmentsClass, 
            updateAssignmentsClass } from '../controllers/assignments_class.controller.js';

const assignments_classRouter = Router();
//Routes AssignmentsClass
/**
 * @openapi
 * /utnbackend/v1/assignments_class:
 *   get:
 *     tags:
 *       - Assignments Class
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
assignments_classRouter.get('/', getAssignmentsClass);
/**
 * @openapi
 * /utnbackend/v1/assignments_class/{id}:
 *   get:
 *     tags:
 *       - Assignments Class
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Assignments Class to search
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
assignments_classRouter.get('/:id', getAssignmentsClassById);
/**
 * @openapi
 * /utnbackend/v1/assignments_class:
 *   post:
 *     tags:
 *       - Assignments Class
 *     requestBody:
 *       description: AssignmentsClass data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               class_id:
 *                 type: integer
 *                 example: 5
 *               user_id:
 *                 type: integer
 *                 example: 10
 *               assignment_class_state:
 *                 type: boolean
 *                 example: true
 *             required:
 *               - class_id
 *               - user_id
 *               - assignment_class_state
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: AssignmentsClass Added successfully
 *                 body:
 *                   type: object
 *                   properties:
 *                     assignments_class:
 *                       type: object
 *                       properties:
 *                         assignment_class_id:
 *                           type: integer
 *                           example: 1
 *                         class_id:
 *                           type: integer
 *                           example: 5
 *                         user_id:
 *                           type: integer
 *                           example: 10
 *                         assignment_class_state:
 *                           type: boolean
 *                           example: true
 */
assignments_classRouter.post('/', createAssignmentsClass);
/**
 * @openapi
 * /utnbackend/v1/assignments_class:
 *   put:
 *     tags:
 *       - Assignments Class
 *     requestBody:
 *       description: AssignmentsClass data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignment_class_id:
 *                 type: integer
 *                 example: 1
 *               class_id:
 *                 type: integer
 *                 example: 5
 *               user_id:
 *                 type: integer
 *                 example: 10
 *               assignment_class_state:
 *                 type: boolean
 *                 example: true
 *             required:
 *               - assignment_class_id
 *               - class_id
 *               - user_id
 *               - assignment_class_state
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
 *                   type: object
 *                   properties:
 *                     assignment_class_id:
 *                       type: integer
 *                       example: 1
 *                     class_id:
 *                       type: integer
 *                       example: 5
 *                     user_id:
 *                       type: integer
 *                       example: 10
 *                     assignment_class_state:
 *                       type: boolean
 *                       example: true
 */
assignments_classRouter.put('/', updateAssignmentsClass);

export { assignments_classRouter };