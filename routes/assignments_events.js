import { Router } from 'express';
import { getAssigmentEvents, getAssigmentEventsById, createAssigmentEvent, 
            updateAssigmentEvent, deleteAssigmentEvent } from '../controllers/assignments_events.controller.js';

const assignments_eventsRouter = Router();
//Routes assigment_events
/**
 * @openapi
 * /utnbackend/v1/assignments_events:
 *   get:
 *     tags:
 *       - Assignments Events
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
assignments_eventsRouter.get('/',getAssigmentEvents);

/**
 * @openapi
 * /utnbackend/v1/assignments_events/{id}:
 *   get:
 *     tags:
 *       - Assignments Events
 *     summary: Get an assignment event by ID
 *     description: Retrieve details of a specific assignment event by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the assignment event to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 assignment_event_id:
 *                   type: integer
 *                   example: 1
 *                 event_id:
 *                   type: integer
 *                   example: 1
 *                 user_id:
 *                   type: integer
 *                   example: 2
 *                
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Assignment event not found
 */

assignments_eventsRouter.get('/:id',getAssigmentEventsById);

/**
 * @openapi
 * /utnbackend/v1/assignments_events:
 *   post:
 *     tags:
 *       - Assignments Events
 *     summary: Create a new assignment event
 *     description: Create a new assignment event in the system.
 *     requestBody:
 *       description: Assignment event data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignment_event_id:
 *                 type: integer
 *                 example: 1
 *               event_id:
 *                 type: integer
 *                 example: 1
 *               user_id:
 *                 type: integer
 *                 example: 2
 *             required:
 *               - event_id
 *               - user_id
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
 *                     assignment_event_id:
 *                       type: integer
 *                       example: 1
 *                     event_id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 2
 *                     
 */

assignments_eventsRouter.post('/', createAssigmentEvent);
/**
 * @openapi
 * /utnbackend/v1/assignments_events:
 *   put:
 *     tags:
 *       - Assignments Events
 *     summary: Update an existing assignment event
 *     description: Update an existing assignment event in the system.
 *     requestBody:
 *       description: Updated assignment event data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               assignment_event_id:
 *                 type: integer
 *                 example: 1
 *               event_id:
 *                 type: integer
 *                 example: 1
 *               user_id:
 *                 type: integer
 *                 example: 2
 *              
 *             required:
 *               - assignment_event_id
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
 *                     assignment_event_id:
 *                       type: integer
 *                       example: 1
 *                     event_id:
 *                       type: integer
 *                       example: 1
 *                     user_id:
 *                       type: integer
 *                       example: 2
 *                    
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Assignment event not found
 */

assignments_eventsRouter.put('/',updateAssigmentEvent);

/**
 * @openapi
 * /utnbackend/v1/assignments_events/{id}:
 *   delete:
 *     tags:
 *       - Assignments Events
 *     summary: Delete an assignment event by ID
 *     description: Delete a specific assignment event by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the assignment event to delete
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
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
 *                     message:
 *                       type: string
 *                       example: Assignment event deleted successfully
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Assignment event not found
 */

assignments_eventsRouter.delete('/:id',deleteAssigmentEvent);

export { assignments_eventsRouter };