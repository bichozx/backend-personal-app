const { Router } = require('express');
const { check } = require('express-validator');



const { validateFields } = require('../middlewares/validate-Fields');
const { googleSignin, login } = require('../controller/auth');


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



module.exports = router;