const { Router } = require('express');
const { check } = require('express-validator');

// const { esRoleValido, emailExiste, existeUsuarioPorId } = require('../helpers/db-validators');

// const { usuariosGet,
//         usuariosPut,
//         usuariosPost,
//         usuariosDelete,
//         usuariosPatch } = require('../controllers/usuarios');

const {  userTaurasDelete, userTaurasPost } = require('../controller/userController');
const { validateFields } = require('../middlewares/validate-Fields');
const { validateJwt } = require('../middlewares/validate-Jwt');
const { isAdminRole, hasRole } = require('../middlewares/validate-Role');
const { userExistsById } = require('../helpers/db-Validators');



const router = Router();

// router.get('/', usuariosGet );

// router.put('/:id',[
//     check('id', 'No es un ID válido').isMongoId(),
//     check('id').custom( existeUsuarioPorId ),
//     check('rol').custom( esRoleValido ),
//     validarCampos
// ],usuariosPut );

router.post(
  '/',
  [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({
      min: 6,
    }),
    check('correo', 'El correo no es válido').isEmail(),
    // check('correo').custom( emailExiste ),
    // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    // check('rol').custom( esRoleValido ),
    validateFields,
  ],
  userTaurasPost
);

router.delete('/:id',[
    validateJwt,
    isAdminRole,
    hasRole('ADMIN_ROLE', 'VENTAR_ROLE','OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userExistsById ),
    validateFields
],userTaurasDelete );

// router.patch('/', usuariosPatch );

module.exports = router;
