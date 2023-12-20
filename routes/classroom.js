import { Router } from 'express';
import { getClassroom, getClassroomById, creatClassroom, updateClassroom } from '../controllers/classroom.controller.js';

const classroomRouter = Router();
//Routes Classrooms
/**
 * @openapi
 * /utnbackend/v1/classroom:
 *   get:
 *     tags:
 *       - Classroom
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
classroomRouter.get('/', getClassroom);
/**
 * @openapi
 * /utnbackend/v1/classroom/{id}:
 *   get:
 *     tags:
 *       - Classroom
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the classroom to search
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
classroomRouter.get('/:id', getClassroomById);
/**
 * @openapi
 * /utnbackend/v1/classroom:
 *   post:
 *     tags:
 *       - Classroom
 *     requestBody:
 *       description: Classroom data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               class_subject:
 *                 type: string
 *                 example: astronomy
 *               class_date_start:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-13T05:00:00.000Z"
 *               class_date_finish:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-25T05:00:00.000Z"
 *               class_state:
 *                 type: boolean
 *                 example: false
 *             required:
 *               - class_subject
 *               - class_date_start
 *               - class_date_finish
 *               - class_state
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Created
 *                 data:
 *                   type: object
 *                   properties:
 *                     class_id:
 *                       type: integer
 *                       example: 123
 *                     class_subject:
 *                       type: string
 *                       example: astronomy
 *                     class_date_start:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-13T05:00:00.000Z"
 *                     class_date_finish:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-25T05:00:00.000Z"
 *                     class_state:
 *                       type: boolean
 *                       example: false
 */
classroomRouter.post('/', creatClassroom);
/**
 * @openapi
 * /utnbackend/v1/classroom:
 *   put:
 *     tags:
 *       - Classroom
 *     requestBody:
 *       description: Classroom data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               class_id:
 *                 type: integer
 *                 example: 5
 *               class_subject:
 *                 type: string
 *                 example: sciences
 *               class_date_start:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-13T05:00:00.000Z"
 *               class_date_finish:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-25T05:00:00.000Z"
 *               class_state:
 *                 type: boolean
 *                 example: false
 *             required:
 *               - class_id
 *               - class_subject
 *               - class_date_start
 *               - class_date_finish
 *               - class_state
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
 *                     class_id:
 *                       type: integer
 *                       example: 5
 *                     class_subject:
 *                       type: string
 *                       example: sciences
 *                     class_date_start:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-13T05:00:00.000Z"
 *                     class_date_finish:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-25T05:00:00.000Z"
 *                     class_state:
 *                       type: boolean
 *                       example: false
 */
classroomRouter.put('/', updateClassroom);

export { classroomRouter };
