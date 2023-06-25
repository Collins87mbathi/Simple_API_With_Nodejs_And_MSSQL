const router = require('express').Router();

const {getEmployees,insertAndUpdate,deleteEmployee} = require("../controllers/Employees");


router.post('/all',getEmployees);
router.post('/create',insertAndUpdate);
router.post('/',deleteEmployee)

module.exports = router;
