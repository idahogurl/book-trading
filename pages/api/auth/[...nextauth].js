import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';
// eslint-disable-next-line no-unused-vars
import pg from 'pg';
import Sequelize from 'sequelize-cockroachdb';
import SequelizeAdapter from '@next-auth/sequelize-adapter';
import User from '../../../server/db/models/user';

// https://sequelize.org/master/manual/getting-started.html#connecting-to-a-database
const sequelize = new Sequelize(process.env.DATABASE_URL);

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/providers/overview
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
});
