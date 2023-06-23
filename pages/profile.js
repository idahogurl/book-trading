import PropTypes from 'prop-types';

import { getServerSession } from 'next-auth/next';

import { Formik } from 'formik';

import { useQuery, useMutation } from '@apollo/client';
import { authOptions } from './api/auth/[...nextauth]';

import GET_USER from '../lib/graphql/GetUser.gql';
import UPDATE_USER from '../lib/graphql/UpdateUser.gql';

import Spinner from '../lib/components/Spinner';
import ErrorNotification from '../lib/components/ErrorNotification';
import Layout from '../lib/components/Layout';

function ProfileForm({ user }) {
  const [updateUser, { loading, error, reset }] = useMutation(UPDATE_USER);

  if (loading) return <Spinner />;
  if (error) return <ErrorNotification onDismiss={reset} />;

  return (
    <Formik
      initialValues={{
        name: user.name,
        location: user.location ? user.location : '',
      }}
      onSubmit={async (values, { setSubmitting }) => {
        const { name, location } = values;
        await updateUser({ variables: { id: user.id, name, location } });
        setSubmitting(false);
      }}
      validate={(values) => {
        const errors = {};
        if (!values.name.trim()) {
          errors.name = 'Required';
        }
        return errors;
      }}
    >
      {({
        handleSubmit, handleChange, handleBlur, errors, touched, values, isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Full Name
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              />
            </label>
            {touched.name && errors.name && <div>{errors.name}</div>}
          </div>

          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location
              <input
                type="text"
                id="location"
                name="location"
                className="form-control"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.location}
              />
            </label>
          </div>

          <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
      )}
    </Formik>
  );
}

ProfileForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    location: PropTypes.string,
  }).isRequired,
};

function Profile({ sessionUserId }) {
  const {
    loading, data, error, refetch,
  } = useQuery(GET_USER, {
    variables: { id: sessionUserId },
    fetchPolicy: 'network-only',
  });

  return (
    <Layout>
      <h1 className="mt-3 mb-3">Update Profile</h1>
      {loading && <Spinner /> }
      {error && <ErrorNotification onDismiss={refetch} />}
      {data && <ProfileForm user={data.user} />}
    </Layout>
  );
}

Profile.propTypes = {
  sessionUserId: PropTypes.string.isRequired,
};

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {
      sessionUserId: session.user.id,
    },
  };
}

export default Profile;
