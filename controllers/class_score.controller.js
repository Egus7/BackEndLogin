import {client} from '../database/database.js';

const getClassScore = async (req, res) => {
    try {
        const response = await client.query("SELECT * FROM class_score");
        res.json(response.rows);
    } catch (err) {
        console.error('Error getting class_score', err);
        res.status(500).json({error: 'An error occurred while getting class_score'});
    }
};

const getClassScoreById = async (req, res) => {
    try {
        const {id} = req.params;
        const response = await client.query("SELECT * FROM class_score WHERE class_score_id = $1", [id]);
        res.json(response.rows[0]);
    } catch (err) {
        console.error('Error getting class_score by id', err);
        res.status(500).json({error: 'An error occurred while getting class_score by id'});
    }
};

const createClassScore = async (req, res) => {
    try {
        const {class_id, user_id, score_one, score_two, score_three, score_final, score_approved, score_attendance_percentage} = req.body;
        const response = await client.query(
            "INSERT INTO public.class_score (class_id, user_id, score_one, score_two, score_three, score_final, score_approved, score_attendance_percentage) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
            [class_id, user_id, score_one, score_two, score_three, score_final, score_approved, score_attendance_percentage]
        );
        const class_score_id = response.rows[0].class_score_id;
        res.json({
            message: "ClassScore Added successfully",
            body: {
                class_score: {
                    class_score_id,
                    class_id,
                    user_id,
                    score_one,
                    score_two,
                    score_three,
                    score_final,
                    score_approved,
                    score_attendance_percentage,
                },
            },
        });
    } catch (err) {
        console.error('Error creating class_score', err);
        res.status(500).json({error: 'An error occurred while creating class_score'});
    }
};

const updateClassScore = async (req, res) => {
    try {
        const {class_score_id, class_id, user_id, score_one, score_two, score_three, score_final, score_approved, score_attendance_percentage} = req.body;
        const response = await client.query(
            "UPDATE public.class_score SET class_id = $1, user_id = $2, score_one = $3, score_two = $4, score_three = $5, score_final = $6, score_approved = $7, score_attendance_percentage = $8 WHERE class_score_id = $9 RETURNING *",
            [class_id, user_id, score_one, score_two, score_three, score_final, score_approved, score_attendance_percentage, class_score_id]
        );
        res.json({
            message: "ClassScore Updated successfully",
            body: {
                class_score: {
                    class_score_id,
                    class_id,
                    user_id,
                    score_one,
                    score_two,
                    score_three,
                    score_final,
                    score_approved,
                    score_attendance_percentage,
                },
            },
        });
    } catch (err) {
        console.error('Error updating class_score', err);
        res.status(500).json({error: 'An error occurred while updating class_score'});
    }
};


export {
    getClassScore,
    getClassScoreById,
    createClassScore,
    updateClassScore
}