import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './VerifyUserForm.module.scss';
import requestApi from '~/api/httpRequest';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const VerifyUserForm = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // try {
        //     const response = await fetch('/auth/verifyEmail', {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({ email, emailToken: token }),
        //     });
        //     // Xử lý kết quả của response nếu cần
        // } catch (error) {
        //     console.error('Error:', error);
        //     // Xử lý lỗi nếu có
        // }
        const data = { email, emailToken: token };
        requestApi('/auth/verifyEmail', 'POST', data)
            .then(async (response) => {
                console.log(response);
                window.alert('Verified successful!');
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
        <form className={cx('verify-user-form')} onSubmit={handleSubmit}>
            <h2>Enter your Email and verification token</h2>
            <div>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
                <label htmlFor="token">Token:</label>
                <input type="text" id="token" value={token} onChange={(e) => setToken(e.target.value)} required />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default VerifyUserForm;
