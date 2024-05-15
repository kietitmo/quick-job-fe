import classNames from 'classnames/bind';
import styles from './RegisterForm.module.scss';
import Button from '~/components/general/Button';
import React, { useState } from 'react';
import requestApi from '~/api/httpRequest';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function RegisterForm() {
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({});
    const navigate = useNavigate();

    const onChange = (event) => {
        let target = event.target;
        setFormData({
            ...formData,
            [target.name]: target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior

        if (
            !formData.username ||
            !formData.password ||
            !formData.email ||
            !formData.fullName ||
            !formData.phoneNumber ||
            !formData.rePassword
        ) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        // Basic validation
        if (
            formData.username.trim() === '' ||
            formData.password.trim() === '' ||
            formData.email.trim() === '' ||
            formData.fullName.trim() === '' ||
            formData.phoneNumber.trim() === '' ||
            formData.rePassword.trim() === ''
        ) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        // Password and re-password match validation
        if (formData.password !== formData.rePassword) {
            setErrorMessage('Password and re-password must match.');
            return;
        }
        console.log(formData);
        // Replace with your actual registration logic
        try {
            requestApi('/auth/signUp', 'POST', formData)
                .then(async (response) => {
                    console.log(response);
                    window.alert('Register successful!');
                    localStorage.setItem('emailToVerify', formData.email);
                    navigate('/verify-user');
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
            <h1>Sign Up</h1>

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

            <div className={cx('re-password', 'group-input')}>
                <label className={cx('re-password-label', 'form-label')}>Re-password:</label>
                <input
                    type="password"
                    className={cx('input')}
                    name="rePassword"
                    placeholder="Enter re-password"
                    onChange={onChange}
                />
            </div>

            <div className={cx('email', 'group-input')}>
                <label className={cx('email-label', 'form-label')}>Email:</label>
                <input
                    type="email"
                    className={cx('input')}
                    name="email"
                    placeholder="Enter email"
                    onChange={onChange}
                />
            </div>

            <div className={cx('full-name', 'group-input')}>
                <label className={cx('full-name-label', 'form-label')}>Full name:</label>
                <input
                    type="text"
                    className={cx('input')}
                    name="fullName"
                    placeholder="Enter full name"
                    onChange={onChange}
                />
            </div>
            <div className={cx('phone-number', 'group-input')}>
                <label className={cx('phone-number-label', 'form-label')}>Phone number:</label>
                <input
                    type="number"
                    className={cx('input')}
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    onChange={onChange}
                />
            </div>

            <Button primary className={cx('summit-button')} type="submit">
                Submit
            </Button>
        </form>
    );
}

export default RegisterForm;
