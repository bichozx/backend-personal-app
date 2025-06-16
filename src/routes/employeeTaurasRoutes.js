const express = require('express');
const { check } = require('express-validator');

const {
  employeeTaurasPost,
  deleteEmployeeTauras,
  employeeGetTauras,
  employeeTaurasPut,
  downloadRetirementZip,
  downloadHiringZip,
  downloadFormatosGenerales,
  employeeTaurasById,
  employeeGetRetiredTauras,
  getProximosARetiro,
} = require('../controller/employeeController');
const {
  idCardExists,
  emailEmployeeExists,
  employeExistsById,
  roleIsValid,
} = require('../helpers/db-Validators');
const { validateFields } = require('../middlewares/validate-Fields');
const { validateJwt } = require('../middlewares/validate-Jwt');
const { isAdminRole, hasRole } = require('../middlewares/validate-Role');

const router = express.Router();

router.get('/', employeeGetTauras);

router.get('/next-retired', getProximosARetiro);


router.get('/retired', employeeGetRetiredTauras);

// 🆕 Nueva ruta para descargar el zip de retiro
router.get('/download-retiro/:cedula', downloadRetirementZip);

router.get('/download-contratos/:cedula', downloadHiringZip);

router.get('/download-formatos', downloadFormatosGenerales);


router.post(
  '/create',
  [
    check('cedula', 'El número de cédula es obligatorio').not().isEmpty(),
    check('cedula').custom(idCardExists),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('correo').custom(emailEmployeeExists),
    check('correo', 'El correo electrónico no es válido').isEmail(),

    check('cargo', 'El cargo es obligatorio').not().isEmpty(),
    check('salario', 'El salario debe ser un número válido').isNumeric(),
    check('tipoContrato', 'El tipo de contrato es obligatorio').not().isEmpty(),
    validateFields,
  ],
  employeeTaurasPost
);

router.get('/:id',[
  check('id', 'No es un ID válido').isMongoId(),
], employeeTaurasById);

router.put('/update/:id',[
  (req, res, next) => {
        console.log('REQ.BODY:', req.body); 
        next();
    },
    validateJwt,
    isAdminRole,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( employeExistsById ),
    validateFields
],employeeTaurasPut );

router.delete(
  '/remove/:id',
  [
    validateJwt,
    isAdminRole,
    hasRole('ADMIN_ROLE', 'VENTAR_ROLE', 'OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(employeExistsById),
    validateFields,
  ],
  deleteEmployeeTauras
);

module.exports = router;
