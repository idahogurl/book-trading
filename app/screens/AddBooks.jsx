import React from 'react';
import { post } from 'axios';
import { Formik } from 'formik';

import BookList from '../components/BookList';

const fields = [
  { id: 'title', name: 'Title' },
  { id: 'author', name: 'Author' },
  { id: 'all', name: 'ISBN' },
];

export default class AddBooks extends React.Component {
  state = {
    books: [],
  }
  render() {
    const { books } = this.state;
    const userId = sessionStorage.getItem('currentUser');
    return (
      <div>
        Add Books to Owned
        <Formik
          initialValues={{ q: 'Five Kingdoms', field: 'title' }}
          onSubmit={(values) => {
            post('/goodreads', { ...values, userId })
              .then(({ data }) => {
                this.setState({ books: data });
              })
              .catch((err) => {
                console.error(err);
              });
          }}
          render={({ values, handleChange, handleSubmit }) => (
            <div className="container">
              <form onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="q"
                  className="form-control d-inline-block w-75"
                  onChange={handleChange}
                  value={values.q}
                />{' '}
                <button type="submit" className="btn btn-primary">Find</button>
                <div>
                  {fields.map(field => (
                    <div
                      key={field.id}
                      className="form-check form-check-inline"
                    >
                      <label className="form-check-label">
                        <input
                          name="field"
                          type="radio"
                          value={field.id}
                          checked={values.field === field.id}
                          onChange={handleChange}
                          className="form-check-input"
                        />{' '}
                        {field.name}
                      </label>
                    </div>
                  ))}
                </div>
              </form>
            </div>
          )}
        />
        <BookList books={books} />
      </div>
    );
  }
}

