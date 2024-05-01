import React, { useEffect } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '~/helper/auth/hooks/useAuth';

const PrivateRoute = ({ allowedRoles, user }) => {
    const { setAuth } = useAuth();

    useEffect(() => {
        setAuth(user);
    }, [setAuth, user]);
    const location = useLocation();

    if (!user) {
        console.log('user null in provate route');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return allowedRoles?.includes(user.role) ? (
        <Outlet />
    ) : user ? (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
    ) : (
        <Navigate to="/login" state={{ from: location }} replace />
    );
};

export default PrivateRoute;
