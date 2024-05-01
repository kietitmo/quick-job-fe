import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import Button from '../../../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faEllipsisVertical,
    faPenToSquare,
    faSignOut,
    faUser,
    faTableColumns,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';
import Menu from '~/components/Popper/Menu';
import config from '~/config';
import useAuth from '~/helper/auth/hooks/useAuth';
import { useEffect } from 'react';
import requestApi from '~/api/httpRequest';

const cx = classNames.bind(styles);

function Header() {
    const { auth, setAuth } = useAuth();
    const storedAuth = JSON.parse(localStorage.getItem('auth'));

    useEffect(() => {
        const auth = JSON.parse(localStorage.getItem('auth'));
        if (auth) {
            setAuth(auth);
        }
    }, [setAuth]);

    const onHandleLogout = async () => {
        await requestApi('/auth/logout', 'GET');
        localStorage.removeItem('auth');
        setAuth({});
        window.location.reload();
    };

    const userMenu = [
        {
            icon: <FontAwesomeIcon icon={faUser} />,
            title: 'View profile',
            to: config.routes.profile,
        },
        {
            icon: <FontAwesomeIcon icon={faTableColumns} />,
            title: 'Dashboard',
            to: config.routes.dashboard,
        },
        {
            icon: <FontAwesomeIcon icon={faSignOut} />,
            title: 'Log out',
            onClick: onHandleLogout,
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
                {storedAuth ? (
                    <div className={cx('user-profile')}>
                        <Button small outline to={routesConfig.createJob} className={cx('create-job-btn')}>
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </Button>
                        <Link to={routesConfig.profile} className={cx('user-info')}>
                            <div className={cx('full-name')}>{auth.fullName}</div>
                            <div className={cx('username')}>{auth.username}</div>
                        </Link>
                        <Link to={routesConfig.profile}>
                            {auth.avatarUrl ? (
                                <img
                                    src={process.env.REACT_APP_BASE_SERVER_URL + auth.avatarUrl}
                                    alt={auth.fullName}
                                    className={cx('user-avatar')}
                                />
                            ) : (
                                <img
                                    className={cx('user-avatar')}
                                    src="/photos/default-avatar.png"
                                    alt="default-avatar"
                                />
                            )}
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
