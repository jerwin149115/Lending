const notificationModel = require('../model/notificationModel');

module.exports = {
    getAdminNotifications: async (req, res) => {
        try {
            const data = await notificationModel.getByAdmin();
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
        }
    },

    getRiderNotifications: async (req, res) => {
        try {
            const rider_id = req.user.rider_id;
            const data = await notificationModel.getByRider(rider_id);
            res.json(data);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
        }
    },

    markAsRead: async (req, res) => {
        try {
            const { notification_id } = req.params;
            await notificationModel.markAsRead(notification_id);
            res.json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
        }
    }
};
