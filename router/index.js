const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const settingsController = require('../controllers/settings-controller');
const recipeController = require('../controllers/recipe-controller');
const ordersController = require('../controllers/orders-controller');
const router = new Router();
const { body } = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

router.post(
    '/registration',
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен содержать минимум 5 символов').isLength({
        min: 5,
        max: 32,
    }),
    userController.registration
);
router.get('/activate/:link', userController.activate);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/refresh', userController.refresh);
router.post('/reset-password', userController.resetPassword);
router.get('/reset-password/:link', userController.activatePassword);

router.get('/users', authMiddleware, userController.getUsers);

router.post('/settings', authMiddleware, settingsController.createSettings);
router.get('/settings/:id', authMiddleware, settingsController.getSettings);

router.post('/recipe-groups', authMiddleware, recipeController.createGroup);
router.get('/recipe-groups/:id', authMiddleware, recipeController.getGroups);
router.delete(
    '/recipe-groups/:id',
    authMiddleware,
    recipeController.removeGroups
);

router.post('/recipe', authMiddleware, recipeController.createRecipe);
router.get('/recipe/:id', authMiddleware, recipeController.getRecipe);
router.delete('/recipe/:id', authMiddleware, recipeController.removeRecipe);

router.get('/orders/:id', authMiddleware, ordersController.getOrders);

router.post('/upload', authMiddleware, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});

module.exports = router;
