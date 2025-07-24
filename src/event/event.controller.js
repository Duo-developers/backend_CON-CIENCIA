import Event from "./event.model.js";

export const createEvent = async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();

        return res.status(201).json({ 
            message: "Event created",
            event: newEvent 
        });

    } catch (error) {
        return res.status(500).json({
            message: "Error creating event",
            error: error.message
        });
    }
};

export const getAllEvents = async (req, res) => {
    try {
        const { limit = 10, from = 0 } = req.query;
        const events = await Event.find({ status: true })
            .sort({ createdAt: -1 })
            .skip(from)
            .limit(limit);

        return res.status(200).json({
            message: "Events fetched successfully",
            events: events
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching events", error: error.message });
    }
};

export const getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);
        if (!event || !event.status) {
            return res.status(404).json({ message: "Event not found or inactive" });
        }

        return res.status(200).json({ 
            message: "Event fetched successfully", 
            event 
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching event", 
            error: error.message 
        });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { externalLinks, ...restData } = req.body;

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
                success: false,
            });
        }


        const updateData = { ...restData };
        if (Array.isArray(externalLinks)) {
            updateData.externalLinks = externalLinks.filter(
                link => link.title && link.url
            );
        }

        const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

        return res.status(200).json({
            message: "Event updated successfully",
            success: true,
            data: updatedEvent,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Error updating event',
            error: error.message
        });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario } = req;

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found",
                success: false
            });
        }

        if (usuario.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                message: "You are not authorized to delete this event",
                success: false
            });
        }


        event.status = false;
        await event.save();

        return res.status(200).json({
            message: "Event deleted successfully (soft delete)",
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete event",
            success: false,
            error: error.message
        });
    }
};