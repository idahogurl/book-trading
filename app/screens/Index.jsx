import React from 'react';
import { Switch, Route } from 'react-router-dom';

import NavBar from '../components/NavBar';
import AddBooksScreen from './AddBooks';
import AvailableBooksScreen from './AvailableBooks';
import RequestTradeScreen from './RequestTrade';
import MyRequestsScreen from './MyRequests';
import MyBooksScreen from './MyBooks';
import ProfileScreen from './Profile';

const IndexScreen = function IndexScreen() {
  return (
    <div>
      <NavBar />
      <div className="container">
        <Switch>
          <Route path="/" exact component={AvailableBooksScreen} />
          <Route path="/books/available" component={AvailableBooksScreen} />
          <Route path="/books/add" component={AddBooksScreen} />
          <Route path="/books/owned" component={MyBooksScreen} />
          <Route path="/requests/my" component={MyRequestsScreen} />
          <Route path="/requests/new" component={RequestTradeScreen} />
          <Route path="/profile" component={ProfileScreen} />
        </Switch>
      </div>
    </div>
  );
  // Button next to each book to add it to your shelf
};
export default IndexScreen;
