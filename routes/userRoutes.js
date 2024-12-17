const express = require('express');
const { getUser, updateUser, deleteUser } = require('../controllers/userController');
const router = express.Router();

router.get('/:id', getUser);
router.put('/:id/update', updateUser);
router.post('/:id/delete', deleteUser);

module.exports = router;
