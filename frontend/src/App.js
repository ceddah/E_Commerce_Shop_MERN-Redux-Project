import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import ProductDetails from './components/product/ProductDetails'
import Login from './components/user/Login';
import Register from './components/user/Register';
import { loadUser } from './actions/userActions';
import store from './store';

import * as ROUTES from './constants/routes';

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
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
