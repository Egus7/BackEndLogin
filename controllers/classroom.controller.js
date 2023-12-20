import {client} from '../database/database.js';

// Isaac
const getClassroom = async (req, res) => {
    try {
        const response = await client.query("SELECT * FROM classroom ");
        res.json(response.rows);
    } catch (err) {
        console.error('Error getting classrooms', err);
        res.status(500).json({error: 'An error occurred while getting classrooms'});
    }
};

const getClassroomById = async (req, res) => {
    try {
        const {id} = req.params;
        const response = await client.query("SELECT * FROM classroom WHERE class_id = $1", [id]);
        res.json(response.rows[0]);
    } catch (err) {
        console.error('Error getting classroom by id', err);
        res.status(500).json({error: 'An error occurred while getting classroom by id'});
    }
};

const creatClassroom = async (req, res) => {
    try {
        const {
            class_subject,
            class_date_start,
            class_date_finish,
            class_state,
        } = req.body;
        const response = await client.query(
            "INSERT INTO public.classroom (class_subject, class_date_start, class_date_finish, class_state) VALUES ($1,$2,$3,$4) RETURNING *",
            [class_subject, class_date_start, class_date_finish, class_state]
        );
        const class_id = response.rows[0].class_id; // Get the automatically generated class_id
        res.json({
            message: "Classroom Added successfully",
            body: {
                classroom: {
                    class_id,
                    class_subject,
                    class_date_start,
                    class_date_finish,
                    class_state,
                },
            },
        });
    } catch (err) {
        console.error('Error creating classroom', err);
        res.status(500).json({error: 'An error occurred while creating classroom'});
    }
};

const updateClassroom = async (req, res) => {
    try {
        const {
            class_id,
            class_subject,
            class_date_start,
            class_date_finish,
            class_state,
        } = req.body;
        const response = await client.query(
            "UPDATE public.classroom SET class_subject = $1, class_date_start = $2, class_date_finish = $3, class_state = $4 WHERE class_id = $5 RETURNING *",
            [class_subject, class_date_start, class_date_finish, class_state, class_id]
        );
        res.json({
            message: "Classroom Updated successfully",
            body: {
                classroom: {
                    class_id,
                    class_subject,
                    class_date_start,
                    class_date_finish,
                    class_state,
                },
            },
        });
    } catch (err) {
        console.error('Error updating classroom', err);
        res.status(500).json({error: 'An error occurred while updating classroom'});
    }
};

export {
    getClassroom,
    getClassroomById,
    creatClassroom,
    updateClassroom
}