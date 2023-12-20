import { client } from '../database/database.js';
import { v4 as uuidv4 } from "uuid";
import bcrypt from  "bcrypt";

const getUsers = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM users ORDER BY user_id');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener usuarios', error);
        res.status(400).json({error: 'Error getting users' });
    }
};

const getUsersByID = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await client.query(`SELECT * FROM users WHERE user_id = '${id}'`);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({error: 'Error getting a user'});
    }
};

const getUserDesByID = async (id) => {
    try {
        const result = await client.query(`SELECT * FROM users WHERE user_code = '${id}'`);
        return result.rows[0]; // Devuelve el primer usuario encontrado o undefined si no hay resultados
    } catch (error) {
        console.error('Error getting a user', error);
        return null; // Devuelve null en caso de error
    }
};

const createUser = async (req, res) => {
    const { user_first_name, user_last_name, user_email, user_phone_number } = req.body;

    try {
        // Autogenerar user_code como UUID
        const user_code = uuidv4();

        // Combinar user_first_name y user_last_name para obtener user_full_name
        const user_full_name = `${user_first_name} ${user_last_name}`;

        // Encriptar user_password (debes recibir user_password en req.body)
        const user_password = await bcrypt.hash(req.body.user_password, 10);

        // Configurar valores predeterminados
        const user_state = true;
        const user_date_register = new Date();

        const result = await client.query(`
            INSERT INTO users (user_code, user_full_name, user_first_name, user_last_name, user_email, 
                                user_password, user_phone_number, user_state, user_date_register) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING user_code, user_full_name, user_first_name, user_last_name, user_email, user_password, 
                user_phone_number, user_state, user_date_register;
        `, [user_code, user_full_name, user_first_name, user_last_name, user_email, user_password, 
                user_phone_number, user_state, user_date_register]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear usuario', error);
        res.status(500).json({ error: 'Error creating user' });
    }
};

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { user_first_name, user_last_name, user_email, user_phone_number } = req.body;

    try {
        // Combinar user_first_name y user_last_name para obtener user_full_name
        const user_full_name = `${user_first_name} ${user_last_name}`;

        const result = await client.query(`
            UPDATE users SET user_full_name = $1, user_first_name = $2, user_last_name = $3, user_email = $4, 
                            user_phone_number = $5 WHERE user_id = $6
            RETURNING *;
        `, [user_full_name, user_first_name, user_last_name, user_email, user_phone_number, userId]);

        if (result.rows.length > 0) {
            res.status(200).json({message: 'Updated user status' });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error al actualizar usuario', error);
        res.status(500).json({ error: 'Error updating user' });
    }
};

const updateUser_State = async (req, res) => {
    const userId = req.params.id;
    const { user_state } = req.body;

    try {
        const result = await client.query(`
            UPDATE users SET user_state = $1 WHERE user_id = $2
            RETURNING *;
        `, [user_state, userId]);

        if (result.rows.length > 0) {
            res.status(200).json({message: 'Estado del usuario actualizado' });
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar usuario', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export {getUsers, getUsersByID, createUser, updateUser, updateUser_State, getUserDesByID};