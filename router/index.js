const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const settingsController = require('../controllers/settings-controller');
const router = new Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post(
    '/registration',
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен содержать минимум 5 символов').isLength({
        min: 5,
        max: 32,
    }),
    userController.registration
);
router.post('/login', userController.login);
router.post('/reset-password', userController.resetPassword);
router.get('/reset-password/:link', userController.activatePassword);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

router.post('/settings', authMiddleware, settingsController.createSettings);
router.get('/settings/:id', authMiddleware, settingsController.getSettings);

module.exports = router;
