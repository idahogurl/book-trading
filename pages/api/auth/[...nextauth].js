import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
// eslint-disable-next-line no-unused-vars
import pg from 'pg';
import Sequelize from 'sequelize-cockroachdb';
import SequelizeAdapter from '@next-auth/sequelize-adapter';
import User from '../../../server/db/models/user';
import configs from '../../../server/db/config/config.json';

// https://sequelize.org/master/manual/getting-started.html#connecting-to-a-database
const env = process.env.NODE_ENV || 'development';
const config = configs[env];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  adapter: SequelizeAdapter(sequelize, {
    models: {
      User: User(sequelize, Sequelize.DataTypes),
    },
  }),
  callbacks: {
    async session({ session, user }) {
      if (session?.user) {
        // eslint-disable-next-line no-param-reassign
        session.user.id = user.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth(authOptions);
