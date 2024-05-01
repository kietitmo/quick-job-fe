import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ResetPassordForm.module.scss';
import requestApi from '~/api/httpRequest';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const ResetPassordForm = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showTokenForm, setShowTokenForm] = useState(false); // State để kiểm soát việc hiển thị form thứ hai
    const navigate = useNavigate();

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        requestApi('/auth/forgot-password', 'POST', { email })
            .then(async (response) => {
                console.log(response);
                window.alert('Send token to your email!');
                setShowTokenForm(true); // Hiển thị form thứ hai sau khi submit form đầu tiên
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

    const handleSubmitTokenAndNewPass = async (e) => {
        e.preventDefault();
        const data = { email, newPasswordToken: token, newPassword };
        requestApi('/auth/reset-password', 'POST', data)
            .then(async (response) => {
                console.log(response);
                window.alert('Changed password successful!');
                navigate('/login');
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
            {!showTokenForm && ( // Kiểm tra xem có nên hiển thị form đầu tiên hay không
                <form className={cx('verify-user-form')} onSubmit={handleSubmitEmail}>
                    <h2>Enter your Email:</h2>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Submit</button>
                </form>
            )}

            {showTokenForm && ( // Hiển thị form thứ hai nếu biến state là true
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
                        <label htmlFor="password">newPassword:</label>
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
            )}
        </>
    );
};

export default ResetPassordForm;
