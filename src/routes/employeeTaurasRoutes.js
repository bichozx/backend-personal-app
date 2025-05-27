const express = require("express");
const { check, validationResult } = require("express-validator");
const employee = require('../models/EmployeeTauras');


const router = express.Router();

router.post(
  "/create",
  [
    check("cedula", "El número de cédula es obligatorio").not().isEmpty(),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("apellido", "El apellido es obligatorio").not().isEmpty(),
    check("correo", "El correo electrónico no es válido").isEmail(),
    check("cargo", "El cargo es obligatorio").not().isEmpty(),
    check("salario", "El salario debe ser un número válido").isNumeric(),
    check("tipoContrato", "El tipo de contrato es obligatorio").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newEmployee = new employee(req.body);
      await newEmployee.save();
      res.status(201).json(newEmployee);
    } catch (error) {
      console.error("Error al registrar el empleado:", error);
      res.status(500).json({ 
          msg: "Error al registrar el empleado", 
          error: error.message 
      });
    }
  }
);

module.exports = router;
