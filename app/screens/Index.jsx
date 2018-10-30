import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NavBar from '../components/NavBar';
import AddBooksScreen from './AddBooks';
import AvailableBooksScreen from './AvailableBooks';
import RequestTradeScreen from './RequestTrade';
import MyRequestsScreen from './MyRequests';
import MyBooksScreen from './MyBooks';
import ProfileScreen from './Profile';
import HeroImage from '../components/HeroImage';
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';

const IndexScreen = function IndexScreen() {
  return (
    <div className="container-fluid">
      <header>
        <div className="d-flex align-items-center">
          <div className="flex-grow-1">
            <img
              src="/images/bookSwap2.svg"
              alt="Book Swap"
              className="mt-3 mb-3 logo"
            />
          </div>
          <div>{'currentUser' in sessionStorage === false ? <LoginButton /> : <LogoutButton />}</div>
        </div>
        <NavBar />
      </header>
      <HeroImage src="images/342462-PA9Q6O-452.jpg" />
      <Switch>
        <Route path="/" exact component={AvailableBooksScreen} />
        <Route path="/books/available" component={AvailableBooksScreen} />
        <Route path="/books/add" component={AddBooksScreen} />
        <Route path="/books/owned" component={MyBooksScreen} />
        <Route path="/requests/my" component={MyRequestsScreen} />
        <Route path="/requests/new" component={RequestTradeScreen} />
        <Route path="/profile" component={ProfileScreen} />
      </Switch>
      <small className="float-right"><a href="https://www.freepik.com/free-photo/books-randomly-stacked-on-shelf_2543726.htm">Images provided by Freepik</a></small>
    </div>
  );
};
export default IndexScreen;
