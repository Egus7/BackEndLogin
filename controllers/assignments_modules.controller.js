import { client } from '../database/database.js';

const getAssignmentsModules = async (req, res) => {
    try {
        const result = await client.query(`
            SELECT am.assignment_id, r.rol_name, u.user_full_name , m.module_name
            FROM assignments_modules AS am
            INNER JOIN roles AS r ON am.rol_id = r.rol_id
            INNER JOIN modules AS m ON am.module_id = m.module_id
            INNER JOIN users AS u ON am.user_id = u.user_id`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener asignaciones de modulos', error);
        res.status(400).json({error: 'Error getting module assignments' });
    }
};

const getAssignmentsModulesByID = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await client.query(`
            SELECT am.assignment_id, r.rol_name, u.user_full_name , m.module_name
            FROM assignments_modules AS am
            INNER JOIN roles AS r ON am.rol_id = r.rol_id
            INNER JOIN modules AS m ON am.module_id = m.module_id
            INNER JOIN users AS u ON am.user_id = u.user_id 
            WHERE am.assignment_id = '${id}'`);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error al obtener una asignacion de modulo', error);
        res.status(400).json({error: 'Error getting module assignments' });
    }
};

const createAssignmentsModules = async (req, res) => {
    const { rol_id, module_id, user_id } = req.body;

    try {

        const result = await client.query(`
            INSERT INTO assignments_modules (rol_id, module_id, user_id) VALUES ($1, $2, $3)
            RETURNING rol_id, module_id, user_id;
        `, [rol_id, module_id, user_id]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear una asignación de modulo', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
/*
const updateModule_Sate = async (req, res) => {
    const moduleId = req.params.id;
    const { module_name, module_state } = req.body;

    try {
        const result = await client.query(`
            UPDATE modules SET module_name = $1, module_state = $2 WHERE module_id = $3
            RETURNING *;
        `, [module_name, module_state, moduleId]);

        if (result.rows.length > 0) {
            res.status(200).json({message: 'Estado del modulo actualizado' });
        } else {
            res.status(404).json({ error: 'Modulo no encontrado' });
        }
    } catch (error) {
        console.error('Error al actualizar modulo', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
*/
const deleteAssignmentsModulesByID = async (req, res) => {
    try {
        const {id} = req.params;
        const result = await client.query(`
            DELETE FROM assignments_modules WHERE assignment_id = '${id}'`);

        res.status(200).json({message: 'Module assignment removed successfully!' });

    } catch (error) {
        console.error('Error al obtener una asignacion de modulo', error);
        res.status(500).json({error: 'Internal Server Error' });
    }
};
export { getAssignmentsModules, getAssignmentsModulesByID, createAssignmentsModules, deleteAssignmentsModulesByID };