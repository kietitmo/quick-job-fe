import classNames from 'classnames/bind';
import styles from './LoginForm.module.scss';
import Button from '../Button';
import React, { useState } from 'react';
import requestApi from '~/api/httpRequest';
import useAuth from '~/helper/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);

function LoginForm() {
    const [errorMessage, setErrorMessage] = useState('');
    const [loginData, setLoginData] = useState({});
    const { setAuth } = useAuth();
    const navigate = useNavigate();

    const onChange = (event) => {
        let target = event.target;
        setLoginData({
            ...loginData,
            [target.name]: target.value,
        });
    };
    const handleLoginGoogle = async () => {
        requestApi('/auth/google/login', 'GET')
            .then(async (response) => {
                const data = response.data;
                const userId = data.user.id;
                const role = data.user.role;
                const username = data.user.username;
                const fullName = data.user.fullName;
                const email = data.user.email;
                const avatarUrl = data.user.avatarUrl;
                const tokens = data.tokens;
                console.log('Login successful:', data);
                await setAuth({ userId, username, fullName, email, role, avatarUrl, tokens });
                localStorage.setItem(
                    'auth',
                    JSON.stringify({ userId, username, fullName, email, role, avatarUrl, tokens }),
                );
                navigate('/');
            })
            .catch((err) => {
                console.log(err);
                if (typeof err.response !== 'undefined') {
                    if (err.response.status === 401) {
                        window.alert('Wrong password or username!');
                    } else if (err.response.status !== 201) {
                        window.alert(err.response.data.message);
                    }
                } else {
                    window.alert('Server is down. Please try again!');
                }
                console.log(err);
            });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        if (!loginData.username || !loginData.password) {
            setErrorMessage('Please enter both username and password.');
            return;
        }

        // Basic validation
        if (loginData.username.trim() === '' || loginData.password.trim() === '') {
            setErrorMessage('Please enter both username and password.');
            return;
        }

        try {
            requestApi('/auth/login', 'POST', loginData)
                .then(async (response) => {
                    const data = response.data;
                    const userId = data.user.id;
                    const role = data.user.role;
                    const username = data.user.username;
                    const fullName = data.user.fullName;
                    const email = data.user.email;
                    const avatarUrl = data.user.avatarUrl;
                    const tokens = data.tokens;
                    console.log('Login successful:', data);
                    await setAuth({ userId, username, fullName, email, role, avatarUrl, tokens });
                    localStorage.setItem(
                        'auth',
                        JSON.stringify({ userId, username, fullName, email, role, avatarUrl, tokens }),
                    );
                    navigate('/');
                    window.location.reload();
                })
                .catch((err) => {
                    console.log(err);
                    if (typeof err.response !== 'undefined') {
                        if (err.response.status === 401) {
                            window.alert('Wrong password or username!');
                        } else if (err.response.status !== 201) {
                            window.alert(err.response.data.message);
                        }
                    } else {
                        window.alert('Server is down. Please try again!');
                    }
                    console.log(err);
                });
        } catch (error) {
            setErrorMessage(error.message);
        }
    };
    return (
        <form className={cx('form-wrapper')} onSubmit={handleSubmit}>
            <h1>Sign In</h1>

            <p className={cx('login-google')} onClick={handleLoginGoogle}>
                Login with Google account?
            </p>

            {errorMessage && <p className={cx('error-message')}>{errorMessage}</p>}

            <div className={cx('username', 'group-input')}>
                <label className={cx('username-label', 'form-label')}>Username:</label>
                <input
                    type="username"
                    className={cx('input')}
                    name="username"
                    placeholder="Enter username"
                    onChange={onChange}
                />
            </div>

            <div className={cx('password', 'group-input')}>
                <label className={cx('password-label', 'form-label')}>Password:</label>
                <input
                    type="password"
                    className={cx('input')}
                    name="password"
                    placeholder="Enter password"
                    onChange={onChange}
                />
            </div>

            <div className={cx('remember-me')}>
                <div className={cx('checkbox')}>
                    <input type="checkbox" className={cx('checkbox-input')} />
                    <label className={cx('checkbox-label')} htmlFor="customCheck1">
                        Remember me
                    </label>
                </div>
            </div>

            <Button primary className={cx('summit-button')} type="submit">
                Submit
            </Button>

            <p className={cx('forgot-password text-right')}>
                Forgot <a href="/reset-password">password?</a>
            </p>
            <p className={cx('register text-right')}>
                I don't have <a href="/register">account</a>
            </p>
        </form>
    );
}

export default LoginForm;
