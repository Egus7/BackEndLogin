import { client } from '../database/database.js';

const getRoles = async (req, res) => {
    try {
        const result = await client.query('SELECT * FROM roles ORDER BY rol_id');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener roles', error);
        res.status(400).json({error: 'Error getting roles' });
    }
};

const getRolesByID = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await client.query(`SELECT * FROM roles WHERE rol_id = '${id}'`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener un rol', error);
        res.status(400).json({error: 'Error getting a role' });
    }
};

const createRol = async (req, res) => {
    const { rol_name } = req.body;

    try {
        const rol_state = true;

        const result = await client.query(`
            INSERT INTO roles (rol_name, rol_state) VALUES ($1, $2)
            RETURNING rol_name, rol_state;
        `, [rol_name, rol_state]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear rol', error);
        res.status(500).json({ error: 'Error creating a new role' });
    }
};

const updateRol_Sate = async (req, res) => {
    const rolId = req.params.id;
    const { rol_name, rol_state } = req.body;

    try {
        const result = await client.query(`
            UPDATE roles SET rol_name = $1, rol_state = $2 WHERE rol_id = $3
            RETURNING *;
        `, [rol_name, rol_state, rolId]);

        if (result.rows.length > 0) {
            res.status(200).json({message: 'Updated role status' });
        } else {
            res.status(404).json({ error: 'Role not found   ' });
        }
    } catch (error) {
        console.error('Error al actualizar rol', error);
        res.status(500).json({ error: 'Error updating a role' });
    }
};

export {getRoles, getRolesByID, createRol, updateRol_Sate};