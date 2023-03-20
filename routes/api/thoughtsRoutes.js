const router = require('express').Router();
const {getAllThoughts, getSingleThought, 
    createNewThought, updateThoughtById, 
    deleteThoughtById, createReaction, 
    deleteReaction} = require('../../controllers/thoughtsController');
  
  // /api/thoughts
  router.route('/')
  .get(getAllThoughts)
  .post(createNewThought)
  
  
  // /api/thoughts/:thoughtId
  router.route('/:thoughtId')
  .get(getSingleThought)
  .put(updateThoughtById)
  .delete(deleteThoughtById);
  
  // /api/thoughts/:thoughtId/reactions
  router.route('/:thoughtId/reactions')
  .post(createReaction)
  .delete(deleteReaction)


module.exports = router;