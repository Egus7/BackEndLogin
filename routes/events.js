import { Router } from 'express';
import { getEvents, getEventsById, createEvent, updateEvent  } from '../controllers/events.controller.js';

const eventsRouter = Router();

//Routes events
/**
 * @openapi
 * /utnbackend/v1/events:
 *   get:
 *     tags:
 *       - Events
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
eventsRouter.get('/',getEvents);
/**
 * @openapi
 * /utnbackend/v1/events/{id}:
 *   get:
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the events to search
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
eventsRouter.get('/:id',getEventsById);
/**
 * @openapi
 * /utnbackend/v1/events:
 *   post:
 *     tags:
 *       - Events
 *     summary: Create a new event
 *     description: Create a new event in the system.
 *     requestBody:
 *       description: Event data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_name:
 *                 type: string
 *                 example: Navidad
 *               event_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-21T20:00:00.000Z"
 *               event_place:
 *                 type: string
 *                 example: Polideportivo UTN
 *               event_description:
 *                 type: string
 *                 example: Agasajo Navideño UTN
 *               event_state:
 *                 type: boolean
 *                 example: true
 *             required:
 *               - event_name
 *               - event_date
 *               - event_place
 *               - event_description
 *               - event_state
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
 *                     event_name:
 *                       type: string
 *                       example: Navidad
 *                     event_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-21T20:00:00.000Z"
 *                     event_place:
 *                       type: string
 *                       example: Polideportivo UTN
 *                     event_description:
 *                       type: string
 *                       example: Agasajo Navideño UTN
 *                     event_state:
 *                       type: boolean
 *                       example: true
 */

eventsRouter.post('/',createEvent);
/**
 * @openapi
 * /utnbackend/v1/events:
 *   put:
 *     tags:
 *       - Events
 *     summary: Update an existing event
 *     description: Update an existing event in the system.
 *     requestBody:
 *       description: Updated event data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_id:
 *                 type: integer
 *                 example: 1
 *               event_name:
 *                 type: string
 *                 example: Navidad Actualizada
 *               event_date:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-25T20:00:00.000Z"
 *               event_place:
 *                 type: string
 *                 example: Salón de Eventos UTN
 *               event_description:
 *                 type: string
 *                 example: Celebración Navideña Actualizada
 *               event_state:
 *                 type: boolean
 *                 example: false
 *             required:
 *               - event_id
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
 *                     event_id:
 *                       type: integer
 *                       example: 1
 *                     event_name:
 *                       type: string
 *                       example: Navidad Actualizada
 *                     event_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-25T20:00:00.000Z"
 *                     event_place:
 *                       type: string
 *                       example: Salón de Eventos UTN
 *                     event_description:
 *                       type: string
 *                       example: Celebración Navideña Actualizada
 *                     event_state:
 *                       type: boolean
 *                       example: false
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Event not found
 */

eventsRouter.put('/',updateEvent);

export { eventsRouter };