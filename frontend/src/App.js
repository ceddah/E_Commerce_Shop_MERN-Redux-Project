import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';

import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';
import ProductDetails from './components/product/ProductDetails'

import * as ROUTES from './constants/routes';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path={ROUTES.HOME} component={Home} exact />
          <Route path={ROUTES.PRODUCT_DETAILS} component={ProductDetails} exact />
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
