import React from 'react';
import { Query, Mutation } from 'react-apollo';
import { Formik } from 'formik';

import GET_USER from '../graphql/GetUser.gql';
import UPDATE_USER from '../graphql/UpdateUser.gql';

import { onError, notify } from '../utils/notifications';

const Profile = function Profile() {
  const currentUser = sessionStorage.getItem('currentUser');

  return (
    <Query query={GET_USER} variables={{ id: currentUser }} fetchPolicy="network-only">
      {({ data, loading, error }) => {
      if (error) onError(error);
      if (loading) return <i className="fa fa-2x fa-spinner fa-spin" />;

        return (
          <Mutation mutation={UPDATE_USER}>
            {updateMutation => (
              <Formik
                initialValues={{ fullName: data.user.fullName, location: data.user.location }}
                onSubmit={async (values, { setSubmitting }) => {
                    const { fullName, location } = values;
                    await updateMutation({ variables: { id: currentUser, fullName, location } });
                    notify('Changes saved');
                    setSubmitting(false);
                  }
                }
                validate={(values) => {
                    const errors = {};
                    if (!values.fullName.trim()) {
                      errors.fullName = 'Required';
                    }
                    return errors;
                  }
                }
                render={({
                  handleSubmit, touched, values, errors, handleChange, handleBlur, isSubmitting,
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <h1>Update Profile</h1>
                      <div className="form-group">
                        <label htmlFor="fullName">Full Name
                          <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            className="form-control"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.fullName}
                          />
                        </label>
                        {touched.fullName && errors.fullName && <div>{errors.fullName}</div>}
                      </div>

                      <label htmlFor="location">Location
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
                      <div>
                        <button className="btn btn-primary" type="submit" disabled={isSubmitting}>Submit</button>
                      </div>
                    </form>
              )}
              />
            )}
          </Mutation>);
      }}
    </Query>
  );
};

export default Profile;
