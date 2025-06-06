const { Router } = require('express');
const { check } = require('express-validator');



const { validateFields } = require('../middlewares/validate-Fields');
const { googleSignin, login, refreshToken } = require('../controller/auth');
const { validateJwt } = require('../middlewares/validate-Jwt');



const router = Router();

router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validateFields
],login );

router.post('/google',[
    check('id_token', 'El id_token es necesario').not().isEmpty(),
    validateFields
], googleSignin );

//Para renovar el token
router.post('/refresh', [validateJwt], refreshToken);



module.exports = router;