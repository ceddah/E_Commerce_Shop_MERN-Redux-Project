import React, { useEffect } from 'react'
import MetaData from './layout/MetaData'

import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../actions/productActions';

import Product from './product/Product';
import Loader from './layout/Loader';

import { useAlert } from 'react-alert';

const Home = () => {
    const dispatch = useDispatch();
    const { loading, products, error, productsCount } = useSelector(state => state.products);

    const alert = useAlert(); 

    useEffect(() => {
        if(error) {
            // alert.success('Message');
            return alert.error(error);
        };

        dispatch(getProducts());

    }, [dispatch, error, alert])

    return (
        <React.Fragment>
            <MetaData title="Buy Best Products Online" />
            {loading ? <Loader /> : (
                <React.Fragment>
                <h1 id="products_heading">Latest Products</h1>

                <section id="products" className="container mt-5">
                    <div className="row">
                        {products && products.map(product => (
                            <Product key={product._id} product={product} />
                        ))}
                    </div>
                </section>
                </React.Fragment>
            )}
        </React.Fragment>
    )
}

export default Home
