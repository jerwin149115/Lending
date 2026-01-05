const express = require('express');
const router = express.Router();
const areaController = require('../controllers/areaController.js');

router.get('/area/get', areaController.getAll);
router.get('/area/get/company', areaController.getByCompany);
router.post('/area/add', areaController.add);
router.put('/area/update/:area_id', areaController.update);
router.delete('/area/delete/:area_id', areaController.delete);

module.exports = router;