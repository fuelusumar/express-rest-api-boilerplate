import User from '../models/user-model';


const getUser = (req, res) => {
  User.get(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(200).json({ status: 'ok', message: 'User not found' });
      } else {
        res.status(200).json({ status: 'ok', user });
      }
    })
    .catch(error => res.status(500).json({ status: 'error', error }));
};

const list = (req, res) => {
  // const { limit = 50, skip = 0 } = req.query;
  User.list({})
    .then((users) => {
      res.status(200).json({ status: 'ok', users });
    })
    .catch(error => res.status(500).json({ status: 'error', error }));
};

const create = (req, res) => {
  const user = new User({
    'emails.0.address': req.body.email,
    'emails.0.default': true,
    password: req.body.password,
    services: [
        { type: 'password', email: req.body.email }
    ],
    profile: {
      firstName: req.body.firstName || '',
      lastName: req.body.lastName || ''
    }
  });

  user.save()
    .then(() => {
      res.status(200).json({ status: 'ok', message: 'User created' });
      return true;
    })
    .catch(error => res.status(400).json({ status: 'error', error: error.message }));
};

const update = (req, res) => {
  // The password can't be updated by this method for security reasons
  // the user must always ask for a reset email
  if (req.body.password) {
    res.status(400).json({ status: 'error', error: { msg: 'You can´t change the password with this endpoint' } });
    return;
  } else if (req.body.email || (!req.body.firstName && !req.body.lastName)) {
    res.status(400).json({ status: 'error', error: { msg: 'Wrong request' } });
    return;
  }
  // Check if the user exist
  User.get(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(400).json({ status: 'error', error: { msg: 'User not found' } });
      } else {
        const updatedUser = {
          'profile.firstName': req.body.firstName || user.profile.firstName,
          'profile.lastName': req.body.lastName || user.profile.lastName
        };
        User.update({ _id: req.params.id }, { $set: updatedUser })
        .exec()
        .then(() => {
          res.status(200).json({ status: 'ok', message: 'User updated' });
        })
        .catch(() => {
          res.status(500).json({ status: 'error', message: 'Could no fullfill the request' });
        });
      }
    })
    .catch(error => res.status(500).json({ status: 'error', error }));
};

export default { list, create, getUser, update };
