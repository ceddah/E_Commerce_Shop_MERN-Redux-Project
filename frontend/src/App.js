import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import { loadUser } from './actions/userActions';
import store from './store';

//Pages
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import ProductDetails from './components/product/ProductDetails'
import Login from './components/user/Login';
import Register from './components/user/Register';
import Profile from './components/user/Profile';
import UpdateProfile from './components/user/UpdateProfile';
import UpdatePassword from './components/user/UpdatePassword';
import ForgotPassword from './components/user/ForgotPassword';
import newPassword from './components/user/NewPassword';
import Cart from './components/cart/Cart';

import * as ROUTES from './constants/routes';
import ProtectedRoute from './components/route/ProtectedRoute'; 

function App() {

  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path={ROUTES.HOME} component={Home} exact />
          <Route path={ROUTES.SEARCH_BY_KEYWORD} component={Home} exact />
          <Route path={ROUTES.PRODUCT_DETAILS} component={ProductDetails} exact />
          <Route path={ROUTES.LOGIN} component={Login} exact />
          <Route path={ROUTES.REGISTER} component={Register} exact />
          <Route path={ROUTES.FORGOT_PASSWORD} component={ForgotPassword} exact />
          <Route path={ROUTES.RESET_PASSWORD} component={newPassword} exact />
          <Route path={ROUTES.CART} component={Cart} exact />
          <ProtectedRoute path={ROUTES.MY_PROFILE} component={Profile} exact />
          <ProtectedRoute path={ROUTES.UPDATE_PROFILE} component={UpdateProfile} exact />
          <ProtectedRoute path={ROUTES.UPDATE_PASSWORD} component={UpdatePassword} exact />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
