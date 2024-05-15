import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ChangingPasswordForm.module.scss';
import requestApi from '~/api/httpRequest';
import { useNavigate } from 'react-router-dom';
import useAuth from '~/helper/auth/hooks/useAuth';

const cx = classNames.bind(styles);

const ChangingPasswordForm = () => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const { auth, setAuth } = useAuth();
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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

    const handleSubmitTokenAndNewPass = async (e) => {
        e.preventDefault();
        const data = { email: user.email, newPasswordToken: token, newPassword };
        requestApi('/auth/reset-password', 'POST', data)
            .then(async (response) => {
                console.log(response);
                window.alert('Changed password successful!');
                await requestApi('/auth/logout', 'GET');
                localStorage.removeItem('auth');
                navigate('/login');
                window.location.reload();
            })
            .catch((err) => {
                console.log(err);
                if (typeof err.response !== 'undefined') {
                    window.alert(err.response.data.message);
                } else {
                    window.alert('Server is down. Please try again!');
                }
                console.log(err);
            });
    };

    return (
        <>
            {
                <form className={cx('verify-user-form')} onSubmit={handleSubmitTokenAndNewPass}>
                    <h2>Enter your Token and new password:</h2>
                    <div>
                        <label htmlFor="token">Token:</label>
                        <input
                            type="text"
                            id="token"
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password">New Password:</label>
                        <input
                            type="password"
                            id="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            }
        </>
    );
};

export default ChangingPasswordForm;
