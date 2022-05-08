const { Thought, User } = require('../models');

module.exports = {
    getThoughts(req, res) {
        User.find()
            .then((thoughts) => res.json(thoughts))
            .catch((err) => res.status(500).json(err));
    },
    getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
        .then(async (thought) =>
          !thought
            ? res.status(404).json({ message: 'No thought with that ID' })
            : res.json({
                thought,
              })
        )
        .catch((err) => {
          console.log(err);
          return res.status(500).json(err);
        });
    },
    createThought(req, res) {
      Thought.create(req.body)
        .then((thought) => {
          Thought.findOneAndUpdate(
            { _id: req.body.userId },
            { $addToSet: { thoughts: thought._id } },
            { runValidators: true, new: true }
          )
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No thought with this id!' })
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
      })
    },
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $set: req.body },
            { runValidators: true, new: true }
          )
            .then((thought) =>
              !thought
                ? res.status(404).json({ message: 'No thought with this id!' })
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    deleteThought(req, res) {
        Thought.findOneAndRemove({ _id: req.params.thoughtId })
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No such thought exists' })
              : Thought.findOneAndUpdate(
                  { users: req.params.thoughtId },
                  { $pull: { users: req.params.thoughtId } },
                  { new: true }
                )
          )
          .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
    },
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $addToSet: { reactions: req.body } },
            { runValidators: true, new: true }
          )
            .then((thought) =>
              !thought
                ? res.status(404).json({ message: 'No thought with this id!' })
                : res.json(thought)
            )
            .catch((err) => res.status(500).json(err));
    },
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            { _id: req.params.reactionId },
            { $pull: { tags: { tagId: req.params.tagId } } },
            { runValidators: true, new: true }
          )
            .then((application) =>
              !application
                ? res.status(404).json({ message: 'No application with this id!' })
                : res.json(application)
            )
            .catch((err) => res.status(500).json(err));
    },
}