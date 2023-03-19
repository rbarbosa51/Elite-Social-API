const router = require('express').Router();
const {
  getAllUsers,
  getSingleUser,
  createNewUser,
  updateById,
  deleteUser,
  addNewFriendUserList,
  removeFriendUserList
} = require('../../controllers/userController');

// /api/users
router.route('/')
.get(getAllUsers)
.post(createNewUser)


// /api/users/:userId
router.route('/:userId')
.get(getSingleUser)
.put(updateById)
.delete(deleteUser);

// /api/users/:userId/friend/:friendId
router.route('/:userId/friend/:friendId')
.post(addNewFriendUserList)
.delete(removeFriendUserList)

module.exports = router;
