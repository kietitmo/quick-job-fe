import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import {
    faEllipsisVertical,
    faPenToSquare,
    faSignOut,
    faUser,
    faTableColumns,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../../../Button';
import Menu from '~/components/Popper/Menu';
import config from '~/config';
import routesConfig from '~/config/routes';
import requestApi from '~/api/httpRequest';
import useAuth from '~/helper/auth/hooks/useAuth';
import styles from './Header.module.scss';

const cx = classNames.bind(styles);

function Header() {
    const { auth, setAuth } = useAuth();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedAuth = JSON.parse(localStorage.getItem('auth'));
        if (storedAuth) {
            setAuth(storedAuth);
        }
    }, [setAuth]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await requestApi(`/users/${auth.userId}`, 'GET');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (auth.userId) {
            fetchUserData();
        }
    }, [auth.userId]);

    const handleLogout = async () => {
        await requestApi('/auth/logout', 'GET');
        localStorage.removeItem('auth');
        setAuth({});
        window.location.reload();
    };

    const userMenu = [
        { icon: <FontAwesomeIcon icon={faUser} />, title: 'View profile', to: config.routes.profile },
        { icon: <FontAwesomeIcon icon={faTableColumns} />, title: 'Dashboard', to: config.routes.dashboard },
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Log out',
            onClick: handleLogout,
            to: config.routes.login,
            separate: true,
        },
    ];

    return (
        <header className={cx('wrapper')}>
            <div className={cx('inner')}>
                <Link to={routesConfig.home} className={cx('header-logo')}>
                    <span>Quick-JOB</span>
                </Link>
                {user ? (
                    <div className={cx('user-profile')}>
                        <Button small outline to={routesConfig.createJob} className={cx('create-job-btn')}>
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </Button>
                        <Link to={routesConfig.profile} className={cx('user-info')}>
                            <div className={cx('full-name')}>{user.fullName}</div>
                            <div className={cx('username')}>{user.username}</div>
                        </Link>
                        <Link to={routesConfig.profile}>
                            <img
                                src={
                                    user.avatarUrl
                                        ? `${process.env.REACT_APP_BASE_SERVER_URL}${user.avatarUrl}`
                                        : '/photos/default-avatar.png'
                                }
                                alt={user.fullName}
                                className={cx('user-avatar')}
                            />
                        </Link>
                        <Menu items={userMenu}>
                            <button className={cx('more-btn')}>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </button>
                        </Menu>
                    </div>
                ) : (
                    <div className={cx('buttons')}>
                        <Button small outline to={routesConfig.createJob} className={cx('create-job-btn')}>
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </Button>
                        <Button small primary to={routesConfig.login}>
                            Log in
                        </Button>
                        <Button small primary to={routesConfig.register}>
                            Sign Up
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;
