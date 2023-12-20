import { Router } from 'express';
import { createUser, getUsers, getUsersByID, updateUser, updateUser_State } from '../controllers/usersController.js';

const usersRouter = Router();
//Routes Users:
/**
 * @openapi
 * /utnbackend/v1/users:
 *   get:
 *     tags:
 *       - Users
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
usersRouter.get('/', getUsers);
/**
 * @openapi
 * /utnbackend/v1/users/{id}:
 *   get:
 *     tags:
 *       - Users
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
usersRouter.get('/:id', getUsersByID);
/**
 * @openapi
 * /utnbackend/v1/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     description: Create a new user in the system.
 *     requestBody:
 *       description: User data to create
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_first_name:
 *                 type: string
 *                 example: LUIS FERNANDO
 *               user_last_name:
 *                 type: string
 *                 example: ROJAS TORRES
 *               user_email:
 *                  type: string
 *                  example: lfrojast@utn.edu.ec    
 *               user_password:
 *                  type: string
 *                  example: lrojas123    
 *               user_phone_number:
 *                 type: string
 *                 example: 0985632659
 *             required:
 *               - user_first_name
 *               - user_last_name
 *               - user_email
 *               - user_phone_number
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
 *               user_first_name:
 *                 type: string
 *                 example: LUIS FERNANDO
 *               user_last_name:
 *                 type: string
 *                 example: ROJAS TORRES   
 *               user_email:
 *                  type: string
 *                  example: lfrojast@utn.edu.ec    
 *               user_password:
 *                  type: string
 *                  example: lrojas123
 *               user_phone_number:
 *                 type: string
 *                 example: 0985632659
 */
usersRouter.post('/', createUser);
/**
 * @openapi
 * /utnbackend/v1/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the users to search
 *         schema:
 *           type: integer
 *     summary: Update an existing user
 *     description: Update an existing user in the system.
 *     requestBody:
 *       description: Updated user data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_first_name:
 *                 type: string
 *                 example: LUIS EDUARDO
 *               user_last_name:
 *                 type: string
 *                 example: ROJAS TORRES
 *               user_email:
 *                 type: string
 *                 example: lerojast@utn.edu.ec
 *               user_phone_number:
 *                 type: string
 *                 example: 0985632569
 *              
 *             required:
 *               - user_id
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
 *               user_first_name:
 *                 type: string
 *                 example: LUIS EDUARDO
 *               user_last_name:
 *                 type: string
 *                 example: ROJAS TORRES
 *               user_email:
 *                 type: string
 *                 example: lerojast@utn.edu.ec
 *               user_phone_number:
 *                 type: string
 *                 example: 0985632569
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
 *                   example: User not found
 */
usersRouter.put('/:id', updateUser);

usersRouter.put('/:id', updateUser_State);

export { usersRouter };