const express = require("express");
const { check } = require("express-validator");

const { employeeTaurasPost } = require('../controller/employeeController');
const { idCardExists,  emailEmployeeExists } = require('../helpers/db-Validators');
const { validateFields } = require('../middlewares/validate-Fields');


const router = express.Router();

router.post(
  "/create",
  [
    check("cedula", "El número de cédula es obligatorio").not().isEmpty(),
    check("cedula").custom(idCardExists),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es obligatorio").not().isEmpty(),
    check('correo').custom(emailEmployeeExists),
    check("correo", "El correo electrónico no es válido").isEmail(),
    
    check("cargo", "El cargo es obligatorio").not().isEmpty(),
    check("salario", "El salario debe ser un número válido").isNumeric(),
    check("tipoContrato", "El tipo de contrato es obligatorio").not().isEmpty(),
    validateFields,
  ],
  employeeTaurasPost
  
  
);

module.exports = router;
