import { User } from './db/models';

const processLogin = async function processLogin(req, res, next) {
  try {
    const {
      id, name, email, screenName,
    } = req.body;

    let user = await User.findOne({ where: { id } });

    if (!user) {
      user = await User.create({
        id,
        fullName: name,
        email,
        screenName,
      });
    }

    res.redirect(302, '/');
    next();
  } catch (err) {
    next(err);
  }
};

export default processLogin;
