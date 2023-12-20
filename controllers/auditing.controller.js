// Importa el cliente de la base de datos
import { client } from '../database/database.js';

// Función para obtener todos los registros de la tabla auditing
const getAuditing = async (req, res) => {
    try {
        const response = await client.query("SELECT audit_id, audit_date, audit_operation, audit_affected_table, user_id, audit_field_affect, audit_ip_user FROM public.auditing");
        res.json(response.rows);
    } catch (err) {
        console.error('Error getting auditing records', err);
        res.status(500).json({ error: 'An error occurred while getting auditing records' });
    }
};

// Función para obtener un registro de la tabla auditing por su ID
const getAuditingById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await client.query("SELECT audit_id, audit_date, audit_operation, audit_affected_table, user_id, audit_field_affect, audit_ip_user FROM public.auditing WHERE audit_id = $1", [id]);
        res.json(response.rows[0]);
    } catch (err) {
        console.error('Error getting auditing record by id', err);
        res.status(500).json({ error: 'An error occurred while getting auditing record by id' });
    }
};

// Exporta las funciones para su uso en otras partes de tu aplicación
export { getAuditing, getAuditingById };