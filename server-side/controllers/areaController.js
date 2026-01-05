const areaService = require('../services/areaService.js');
module.exports = {
    getAll: async(req, res) => {
        try {
            const data = await areaService.findAll();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error'});
        }
    },
    getByCompany: async(req, res) => {
        try {
            const { company } = req.query;
            const data = company ? await areaService.findByCompany(company): await areaService.findAll();
            res.json({ success: true, data});
        } catch(err) {
            res.status(500).json({ error: 'Failed to fetch the areas'});
        }
    },
    add: async(req, res) => {
        try {
            const { name, lending_company } = req.body;
            const result = await areaService.create(name, lending_company);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: 'Server Error'});
        }
    },
    update: async(req, res) => {
        try {
            const { area_id } = req.params;
            const { name } = req.body;
            const result = await areaService.update(area_id, name);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: 'Server Error'});
        }
    },
    delete: async(req, res) => {
        try {
            const { area_id } = req.params;
            const result = await areaService.delete(area_id);
            res.json(result);
        } catch (err) {
            res.status(500).json({ error: 'Server Error'});
        }
    }
}