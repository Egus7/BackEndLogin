import {client} from '../database/database.js';

const getAssignmentsClass = async (req, res) => {
    try {
        const response = await client.query("SELECT assignment_class_id, class_id, user_id, assignment_class_state FROM assignments_class");
        res.json(response.rows);
    } catch (err) {
        console.error('Error getting assignments_class', err);
        res.status(500).json({error: 'An error occurred while getting assignments_class'});
    }
};

const getAssignmentsClassById = async (req, res) => {
    try {
        const {id} = req.params;
        const response = await client.query("SELECT assignment_class_id, class_id, user_id, assignment_class_state FROM assignments_class WHERE assignment_class_id = $1", [id]);
        res.json(response.rows[0]);
    } catch (err) {
        console.error('Error getting assignments_class by id', err);
        res.status(500).json({error: 'An error occurred while getting assignments_class by id'});
    }
};

const createAssignmentsClass = async (req, res) => {
    try {
        const {class_id, user_id, assignment_class_state} = req.body;
        const response = await client.query(
            "INSERT INTO public.assignments_class (class_id, user_id, assignment_class_state) VALUES ($1,$2,$3) RETURNING *",
            [class_id, user_id, assignment_class_state]
        );
        const assignment_class_id = response.rows[0].assignment_class_id;
        res.json({
            message: "AssignmentsClass Added successfully",
            body: {
                assignments_class: {
                    assignment_class_id,
                    class_id,
                    user_id,
                    assignment_class_state,
                },
            },
        });
    } catch (err) {
        console.error('Error creating assignments_class', err);
        res.status(500).json({error: 'An error occurred while creating assignments_class'});
    }
};

const updateAssignmentsClass = async (req, res) => {
    try {
        const {assignment_class_id, class_id, user_id, assignment_class_state} = req.body;
        const response = await client.query(
            "UPDATE public.assignments_class SET class_id = $1, user_id = $2, assignment_class_state = $3 WHERE assignment_class_id = $4 RETURNING *",
            [class_id, user_id, assignment_class_state, assignment_class_id]
        );
        res.json({
            message: "AssignmentsClass Updated successfully",
            body: {
                assignments_class: {
                    assignment_class_id,
                    class_id,
                    user_id,
                    assignment_class_state,
                },
            },
        });
    } catch (err) {
        console.error('Error updating assignments_class', err);
        res.status(500).json({error: 'An error occurred while updating assignments_class'});
    }
};

export {
    getAssignmentsClass,
    getAssignmentsClassById,
    createAssignmentsClass,
    updateAssignmentsClass,
}