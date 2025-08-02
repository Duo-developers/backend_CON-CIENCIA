import Event from "./event.model.js";

export const createEvent = async (req, res) => {
    try {
        const eventData = req.body;
        const { usuario } = req;
        eventData.user = usuario._id; 

        const newEvent = new Event(eventData);
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

        const [events, total] = await Promise.all([
            Event.find({ status: true })
                .sort({ createdAt: -1 })
                .skip(Number(from))     
                .limit(Number(limit)),
            
            Event.countDocuments({ status: true }) 
        ]);

        return res.status(200).json({
            message: "Events fetched successfully",
            total,
            events
        });

    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching events", 
            error: error.message 
        });
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
        const { usuario } = req; 
        const { externalLinks, ...restData } = req.body;

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (event.user.toString() !== usuario._id.toString()) {
            return res.status(403).json({ message: "Forbidden: You do not own this event" });
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
            return res.status(404).json({ message: "Event not found" });
        }

        const isOwner = event.user.toString() === usuario._id.toString();
        const isAdmin = usuario.role === 'ADMIN_ROLE';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Forbidden: You are not authorized to delete this event" });
        }

        event.status = false; 
        await event.save();

        return res.status(200).json({
            message: "Event soft-deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to delete event",
            error: error.message
        });
    }
};

export const getMyEvents = async (req, res) => {
    try {
        const { usuario } = req;
        const { limit = 10, from = 0 } = req.query;

        const [events, total] = await Promise.all([
            Event.find({ user: usuario._id, status: true })
                .sort({ createdAt: -1 })
                .skip(Number(from))
                .limit(Number(limit)),
            
            Event.countDocuments({ user: usuario._id, status: true })
        ]);

        return res.status(200).json({
            message: "Your events retrieved successfully",
            success: true,
            total,
            data: events
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to retrieve your events",
            success: false,
            error: error.message
        });
    }
};
