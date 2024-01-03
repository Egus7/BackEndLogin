import { Router } from 'express';
import { getAssignmentsModules, getAssignmentsModulesByID, getAssignmentsModulesByUserID,
        createAssignmentsModules, deleteAssignmentsModulesByID } from '../controllers/assignments_modules.controller.js';

const assignments_modulesRouter = Router();

// Ruta protegida que requiere el rol "Usuarios"
// Routes Assignments Modules:
/**
 * @openapi
 * /utnbackend/v1/assignments_modules:
 *   get:
 *     tags:
 *       - Assignments Modules
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
assignments_modulesRouter.get('/', getAssignmentsModules);
/**
 * @openapi
 * /utnbackend/v1/assignments_modules/{id}:
 *   get:
 *     tags:
 *       - Assignments Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the assignment module to search
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
 */
assignments_modulesRouter.get('/:id', getAssignmentsModulesByID);
/**
 * @openapi
 * /utnbackend/v1/assignments_modules/users/{id}:
 *   get:
 *     tags:
 *       - Assignments Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID of the assignment module to search
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
 */
assignments_modulesRouter.get('/users/:id', getAssignmentsModulesByUserID);
/**
 * @openapi
 * /utnbackend/v1/assignments_modules:
 *   post:
 *     tags:
 *       - Assignments Modules
 *     summary: Create a new assignment module
 *     description: Create a new assignment module in the system.
 *     requestBody:
 *       description: Assignment module data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rol_id:
 *                 type: integer
 *                 example: 1
 *               module_id:
 *                 type: integer
 *                 example: 5
 *               user_id:
 *                 type: integer
 *                 example: 1
 *             required:
 *               - rol_id
 *               - module_id
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
 *                     rol_id:
 *                       type: integer
 *                       example: 1
 *                     module_id:
 *                       type: integer
 *                       example: 5
 *                     user_id:
 *                       type: integer
 *                       example: 1
 */
assignments_modulesRouter.post('/', createAssignmentsModules);
/*assignments_modulesRouter.put('/:id', updateModule_Sate);*/
/**
 * @openapi
 * /utnbackend/v1/assignments_modules/{id}:
 *   delete:
 *     tags:
 *       - Assignments Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the assignment module to delete
 *         schema:
 *           type: integer
 *     summary: Delete an assignment module
 *     description: Delete an assignment module in the system.
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
 *                       example: Assignment module deleted successfully
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Assignment module not found
 */
assignments_modulesRouter.delete('/:id', deleteAssignmentsModulesByID);

export { assignments_modulesRouter };