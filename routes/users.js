const router = require('express').Router();
const {
  getUsers, getUserById, getUserMe, updateUser, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUserById);

router.get('/me', getUserMe);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
