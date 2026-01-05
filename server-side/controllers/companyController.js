const companyService = require('../services/companyService.js');

module.exports = {
    getAll: async(req, res) => {
        try {
            const data = await companyService.findAll();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error'});
        }
    },
    add: async(req, res) => {
        try {
            const { name } = req.body;
            const data = await companyService.create(name);
            res.json({ success: true, result: data}); 
        } catch (err) {
            res.status(500).json({ error: 'Server Error'});
        }
    },
    update: async(req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            const data = await companyService.update(id, name);
            res.json({ success: true, result: data});
        } catch (err) {
            res.status(500).json({ error: 'Server Error'});
        }
    },
    delete: async(req, res) => {
        try {
            const { id } = req.params;
            const data = await companyService.delete(id);
            res.json({ success: true, result: data});
        } catch (err) {
            res.status(500).json({ error: 'Server Error'});
        }
    }
}