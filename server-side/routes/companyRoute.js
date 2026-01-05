const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController.js');

router.get('/company/get', companyController.getAll);
router.post('/company/add', companyController.add);
router.put('/company/update/:id', companyController.update);
router.delete('/company/delete/:id', companyController.delete);

module.exports = router;