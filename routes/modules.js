import { Router } from 'express';
import { getModules, getModulesByID, createModule, updateModule_Sate } from '../controllers/modulesController.js';
const modulesRouter = Router();

// Ruta protegida que requiere el rol "Usuarios"
//Routes Modules:
/**
 * @openapi
 * /utnbackend/v1/modules:
 *   get:
 *     tags:
 *       - Modules
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
modulesRouter.get('/', getModules);
/**
 * @openapi
 * /utnbackend/v1/modules/{id}:
 *   get:
 *     tags:
 *       - Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the users to search
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
modulesRouter.get('/:id', getModulesByID);
/**
 * @openapi
 * /utnbackend/v1/modules:
 *   post:
 *     tags:
 *       - Modules
 *     summary: Create a new module
 *     description: Create a new module in the system.
 *     requestBody:
 *       description: Module data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module_name:
 *                 type: string
 *                 example: Auditoria
 *               module_state:
 *                  type: boolean
 *                  example: true  
 *             required:
 *               - module_name
 *               - module_state
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
 *             properties:
 *               module_name:
 *                 type: string
 *                 example: Auditoria
 *               module_state:
 *                  type: boolean
 *                  example: true  
 */
modulesRouter.post('/', createModule);
/**
 * @openapi
 * /utnbackend/v1/modules/{id}:
 *   put:
 *     tags:
 *       - Modules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the modules to search
 *         schema:
 *           type: integer
 *     summary: Update an existing module
 *     description: Update an existing module in the system.
 *     requestBody:
 *       description: Updated module data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               module_name:
 *                 type: string
 *                 example: Auditoria
 *               module_state:
 *                 type: boolean
 *                 example: false
 *              
 *             required:
 *               - module_id
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
 *             properties:
 *               module_name:
 *                 type: string
 *                 example: Auditoria
 *               module_state:
 *                 type: boolean
 *                 example: false
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
 *                   example: Module not found
 */
modulesRouter.put('/:id', updateModule_Sate);

export { modulesRouter };