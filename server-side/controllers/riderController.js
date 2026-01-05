const riderService = require('../services/riderService.js');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config/jwt.js');

module.exports = {
    login: (req, res) => {
        const { username, password } = req.body;
        if (!username || !password)
            return res.status(400).json({ error: 'Username and password required' });

        const riderModel = require('../model/riderModel.js');
        riderModel.findByUsername(username, async (err, result) => {
            if (err) return res.status(500).json({ error: 'Database Error' });
            if (!result.length)
                return res.status(401).json({ error: 'Invalid credentials' });

            const user = result[0];
            const bcrypt = require('bcrypt');
            const isValid = await bcrypt.compare(password, user.password);

            
            if (!isValid)
                return res.status(401).json({ error: 'Invalid credentials' });

            const token = jwt.sign(
                { rider_id: user.rider_id, username: user.username },
                SECRET_KEY
            );
            

            res.json({ message: 'Login successful', token });
        });
    },
    register: async (req, res) => {
        const { username, password, area, lending_company } = req.body;
        if (!username || !password || !area || !lending_company)
            return res.status(400).json({ error: 'All fields required' });

        try {
            const result = await riderService.register(
                username, password, area, lending_company
            );
            res.json(result);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.error });
        }
    },
    update: async (req, res) => {
        const { rider_id } = req.params;
        const { username, password, area, lending_company } = req.body;

        if (!username || !area || !lending_company)
            return res.status(400).json({ error: 'Missing fields' });

        try {
            const result = await riderService.update(
                rider_id, username, password || null, area, lending_company
            );
            res.json(result);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.error });
        }
    },
    delete: async (req, res) => {
        try {
            const result = await riderService.delete(req.params.rider_id);
            res.json(result);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.error });
        }
    },
    getById: async (req, res) => {
        const { rider_id } = req.params;

        try {
            const rider = await riderService.findById(rider_id);

            if (!rider) {
                return res.status(404).json({ error: 'Rider not found' });
            }

            res.json(rider);
        } catch (error) {
            res.status(500).json({ error: 'Server Error' });
        }
    },
    getAll: async (req, res) => {
        try {
            res.json(await riderService.findAll());
        } catch {
            res.status(500).json({ error: 'Server Error' });
        }
    },
    getRiderProfile: async (req, res) => {
        try {
            const username = req.user.username;
            const rider = await riderService.getRiderProfile(username);
            res.json({
                rider_id: rider.rider_id,
                username: rider.username,
                area: rider.area,
                lending_company: rider.lending_company,
            });
        } catch (err) {
            res.status(err.status || 500).json({
                error: err.error || 'Server Error'
            });
        }
    },
    getRiderProfile: async (req, res) => {
        try {
            const username = req.user.username;

            const rider = await riderService.getRiderProfile(username);

            res.json({
                rider_id: rider.rider_id,
                username: rider.username,
                area: rider.area,
                lending_company: rider.lending_company,
            });
        } catch (err) {
            res.status(err.status || 500).json({
                error: err.error || 'Server Error',
            });
        }
    },
    getStats: async (req, res) => {
        try {
            const { rider_id } = req.params;
            const stats = await riderService.getStats(rider_id);
            res.json(stats);
        } catch (err) {
            res.status(err.status || 500).json({
                error: err.error || 'Server Error',
            });
        }
    },
    getRecentPaymentsAll: async (req, res) => {
        try {
            const payments = await riderService.getRecentPaymentsAll();
            res.json(payments);
        } catch (err) {
            res.status(err.status || 500).json({ error: err.error || 'Server Error' });
        }
    },
    getRecentPayments: async (req, res) => {
        try {
            const { rider_id } = req.params;
            const payments = await riderService.getRecentPayments(rider_id);
            res.json(payments);
        } catch {
            res.status(500).json({ error: 'Server Error' });
        }
    },
    getMissedPayments: async (req, res) => {
        try {
            const { rider_id } = req.params;
            if (!rider_id || isNaN(rider_id)) {
                return res.status(400).json({ error: 'Invalid rider_id' });
            }

            const payments = await riderService.getMissedPayments(Number(rider_id));
            res.status(200).json(payments);
        } catch (err) {
            console.error('Get Missed Payments Error:', err);
            res.status(err.status || 500).json({
                error: err.error || 'Server Error'
            });
        }
    },
};
