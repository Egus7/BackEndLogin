import { Router } from 'express';
import { getClassScore, getClassScoreById, createClassScore, 
            updateClassScore } from '../controllers/class_score.controller.js';

const class_scoreRouter = Router();

//Routes class_score
/**
 * @openapi
 * /utnbackend/v1/class_score:
 *   get:
 *     tags:
 *       - Class Score
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
class_scoreRouter.get('/', getClassScore);
/**
 * @openapi
 * /utnbackend/v1/class_score/{id}:
 *   get:
 *     tags:
 *       - Class Score
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the Class Score to search
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
class_scoreRouter.get('/:id', getClassScoreById);
/**
 * @openapi
 * /utnbackend/v1/class_score:
 *   post:
 *     tags:
 *       - Class Score
 *     requestBody:
 *       description: Class Score data to create
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
 *               score_one:
 *                 type: number
 *                 example: 85.5
 *               score_two:
 *                 type: number
 *                 example: 90.0
 *               score_three:
 *                 type: number
 *                 example: 75.8
 *               score_final:
 *                 type: number
 *                 example: 83.7
 *               score_approved:
 *                 type: boolean
 *                 example: true
 *               score_attendance_percentage:
 *                 type: number
 *                 example: 95.2
 *             required:
 *               - class_id
 *               - user_id
 *               - score_one
 *               - score_two
 *               - score_three
 *               - score_final
 *               - score_approved
 *               - score_attendance_percentage
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
 *                   example: ClassScore Added successfully
 *                 body:
 *                   type: object
 *                   properties:
 *                     class_score:
 *                       type: object
 *                       properties:
 *                         class_score_id:
 *                           type: integer
 *                           example: 1
 *                         class_id:
 *                           type: integer
 *                           example: 5
 *                         user_id:
 *                           type: integer
 *                           example: 10
 *                         score_one:
 *                           type: number
 *                           example: 85.5
 *                         score_two:
 *                           type: number
 *                           example: 90.0
 *                         score_three:
 *                           type: number
 *                           example: 75.8
 *                         score_final:
 *                           type: number
 *                           example: 83.7
 *                         score_approved:
 *                           type: boolean
 *                           example: true
 *                         score_attendance_percentage:
 *                           type: number
 *                           example: 95.2
 */
class_scoreRouter.post('/', createClassScore);
/**
 * @openapi
 * /utnbackend/v1/class_score:
 *   put:
 *     tags:
 *       - Class Score
 *     requestBody:
 *       description: ClassScore data to update
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               class_score_id:
 *                 type: integer
 *                 example: 1
 *               class_id:
 *                 type: integer
 *                 example: 5
 *               user_id:
 *                 type: integer
 *                 example: 10
 *               score_one:
 *                 type: number
 *                 example: 90.0
 *               score_two:
 *                 type: number
 *                 example: 85.5
 *               score_three:
 *                 type: number
 *                 example: 88.2
 *               score_final:
 *                 type: number
 *                 example: 87.3
 *               score_approved:
 *                 type: boolean
 *                 example: true
 *               score_attendance_percentage:
 *                 type: number
 *                 example: 96.5
 *             required:
 *               - class_score_id
 *               - class_id
 *               - user_id
 *               - score_one
 *               - score_two
 *               - score_three
 *               - score_final
 *               - score_approved
 *               - score_attendance_percentage
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: ClassScore Updated successfully
 *                 body:
 *                   type: object
 *                   properties:
 *                     class_score:
 *                       type: object
 *                       properties:
 *                         class_score_id:
 *                           type: integer
 *                           example: 1
 *                         class_id:
 *                           type: integer
 *                           example: 5
 *                         user_id:
 *                           type: integer
 *                           example: 10
 *                         score_one:
 *                           type: number
 *                           example: 90.0
 *                         score_two:
 *                           type: number
 *                           example: 85.5
 *                         score_three:
 *                           type: number
 *                           example: 88.2
 *                         score_final:
 *                           type: number
 *                           example: 87.3
 *                         score_approved:
 *                           type: boolean
 *                           example: true
 *                         score_attendance_percentage:
 *                           type: number
 *                           example: 96.5
 */
class_scoreRouter.put('/', updateClassScore);

export { class_scoreRouter };