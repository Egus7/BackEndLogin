import { Router } from 'express';
import { getRoles, getRolesByID, createRol, updateRol_Sate } from '../controllers/rolesController.js';

const rolesRouter = Router();

// Ruta protegida que requiere el rol "Usuarios"
// Routes Roles:
/**
 * @openapi
 * /utnbackend/v1/roles:
 *   get:
 *     tags:
 *       - Roles
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
rolesRouter.get('/', getRoles);
/**
 * @openapi
 * /utnbackend/v1/roles/{id}:
 *   get:
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the role to search
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
rolesRouter.get('/:id', getRolesByID);
/**
 * @openapi
 * /utnbackend/v1/roles:
 *   post:
 *     tags:
 *       - Roles
 *     summary: Create a new role
 *     description: Create a new role in the system.
 *     requestBody:
 *       description: Role data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rol_name:
 *                 type: string
 *                 example: Auditor
 *               rol_state:
 *                  type: boolean
 *                  example: true  
 *             required:
 *               - rol_name
 *               - rol_state
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
 *                     rol_name:
 *                       type: string
 *                       example: Auditor
 *                     rol_state:
 *                       type: boolean
 *                       example: true
 */
rolesRouter.post('/', createRol);
/**
 * @openapi
 * /utnbackend/v1/roles/{id}:
 *   put:
 *     tags:
 *       - Roles
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the role to update
 *         schema:
 *           type: integer
 *     summary: Update an existing role
 *     description: Update an existing role in the system.
 *     requestBody:
 *       description: Updated role data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rol_name:
 *                 type: string
 *                 example: Auditor
 *               rol_state:
 *                 type: boolean
 *                 example: false
 *             required:
 *               - rol_id
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
 *                     rol_name:
 *                       type: string
 *                       example: Auditor
 *                     rol_state:
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
 *                   example: Role not found
 */
rolesRouter.put('/:id', updateRol_Sate);

export { rolesRouter };