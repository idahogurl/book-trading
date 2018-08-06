import { User } from './db/models';

const processLogin = async function processLogin(req, res, next) {
  try {
    const {
      id, name, email, screenName,
    } = req.body;

    const token = Math.random().toString(36).substr(2, 100);
    let user = await User.findOne({ where: { id } });

    if (!user) {
      user = await User.create({
        id,
        fullName: name,
        email,
        screenName,
      });
    }

    res.cookie('token', `${user.id}|${token}`, { signed: true, httpOnly: true });
    res.redirect(302, '/');
    next();
  } catch (err) {
    next(err);
  }
};

export default processLogin;
