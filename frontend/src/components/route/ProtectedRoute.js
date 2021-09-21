import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LOGIN } from '../../constants/routes';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated, loading, user } = useSelector(state => state.auth);
    return (
        <React.Fragment>
            {loading === false && (
                <Route 
                    {...rest} 
                    render={props => {
                        if(isAuthenticated === false) {
                            return <Redirect to={LOGIN} />
                        }
                        return <Component {...props} />
                    }}
                />
            )}
        </React.Fragment>
    )
}

export default ProtectedRoute
