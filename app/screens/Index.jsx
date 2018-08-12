import React from 'react';
import { Switch, Route } from 'react-router-dom';

import NavBar from '../components/NavBar';
import AddBooksScreen from './AddBooks';
import AvailableBooksScreen from './AvailableBooks';
import RequestTradeScreen from './RequestTrade';
import MyRequestsScreen from './MyRequests';

const IndexScreen = function IndexScreen() {
  return (
    <div>
      <NavBar />
      <div className="container">
        <Switch>
          <Route path="/" exact component={AvailableBooksScreen} />
          <Route path="/books/available" component={AvailableBooksScreen} />
          <Route path="/books/add" component={AddBooksScreen} />
          <Route path="/requests" exact component={MyRequestsScreen} />
          <Route path="/requests/new" component={RequestTradeScreen} />
        </Switch>
      </div>
    </div>
  );
  // Button next to each book to add it to your shelf
};
export default IndexScreen;
