import { client } from '../database/database.js';

const getEvents = async (req, res) => {
    try {
        const response = await client.query("SELECT * FROM events ");
        res.json(response.rows);
    } catch (err) {
        console.error('Error getting classrooms', err);
        res.status(500).json({ error: 'An error occurred while getting events' });
    }
};

const getEventsById = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await client.query("SELECT * FROM events WHERE event_id = $1", [id]);
        res.json(response.rows[0]);
    } catch (err) {
        console.error('Error getting class_score by id', err);
        res.status(500).json({ error: 'An error occurred while getting class_score by id' });
    }
};

const createEvent = async (req, res) => {
    try {
        console.log(req.body); // Agrega este console.log para depurar
        const { event_name, event_date, event_place, event_description, event_state } = req.body;
        const response = await client.query(
            "INSERT INTO public.events (event_name, event_date, event_place, event_description, event_state) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [event_name, event_date, event_place, event_description, event_state]
        );
        const event_id = response.rows[0].event_id; // Get the automatically generated class_id

        //const newEvent = response.rows[0];
        res.json({
            message: "Event added successfully",
            body: {
                event: {
                    event_id, 
                    event_name, 
                    event_date, 
                    event_place, 
                    event_description,
                    event_state
                }
            },
        });
    } catch (err) {
        console.error('Error creating event', err);
        res.status(500).json({ error: 'An error occurred while creating the event' });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { event_id, event_name, event_date, event_place, event_description, event_state } = req.body;

        const response = await client.query(
            "UPDATE public.events SET event_name = $1, event_date = $2, event_place = $3, event_description = $4, event_state = $5 WHERE event_id = $6 RETURNING *",
            [event_name, event_date, event_place, event_description, event_state, event_id]
        );

        if (response.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const updatedEvent = response.rows[0];
        res.json({
            message: "Event updated successfully",
            body: {
                event: updatedEvent,
            },
        });
    } catch (err) {
        console.error('Error updating event', err);
        res.status(500).json({ error: 'An error occurred while updating the event' });
    }
};


export {
    getEvents,
    getEventsById,
    createEvent,
    updateEvent
}