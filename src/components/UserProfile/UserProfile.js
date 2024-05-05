import classNames from 'classnames/bind';
import styles from './UserProfile.module.scss';
import React, { useState, useEffect } from 'react';
import requestApi from '~/api/httpRequest';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [update, setUpdate] = useState(false);
    const [fullname, setFullname] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const auth = JSON.parse(localStorage.getItem('auth'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await requestApi(`/users/${auth.userId}`, 'GET');
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, [auth.userId]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
    };

    const handleUpdateprofile = () => {
        setUpdate(!update);
    };

    const handleSubmitFullName = async (e) => {
        e.preventDefault();
        try {
            const response = await requestApi(`/users/${auth.userId}`, 'PATCH', { fullName: fullname });
            setUser((prevUser) => ({
                ...prevUser,
                fullName: response.data.fullName,
            }));
            alert('Full name updated successfully!');
        } catch (error) {
            console.error('Error updating full name:', error);
            alert('Failed to update full name. Please try again.');
        }
    };

    const handleSubmitPhonenumber = async (e) => {
        e.preventDefault();
        try {
            const response = await requestApi(`/users/${auth.userId}`, 'PATCH', { phoneNumber: phonenumber });
            setUser((prevUser) => ({
                ...prevUser,
                phoneNumber: response.data.phoneNumber,
            }));
            setUpdate(false);
            alert('Phone number updated successfully!');
        } catch (error) {
            console.error('Error updating phone number:', error);
            alert('Failed to update phone number. Please try again.');
        }
    };

    const handleCancelUpdate = async () => {
        setUpdate(false);
    };

    // Hàm xử lý sự kiện khi nhấn nút "Thay đổi Avatar"
    const handleAvatarUpload = async () => {
        if (!avatarFile) {
            alert('Please select an image first!');
            return;
        }

        const formData = new FormData();
        formData.append('avatar', avatarFile);

        try {
            const response = await requestApi('/users/upload-avatar', 'POST', formData);
            setUser((prevUser) => ({
                ...prevUser,
                avatarUrl: response.data.avatarUrl,
            }));
            alert('Avatar updated successfully!');
        } catch (error) {
            console.error('Error updating avatar:', error);
            alert('Failed to update avatar. Please try again.');
        }
    };

    const handleChangePassword = () => {
        try {
            requestApi('/auth/change-password', 'POST');
            navigate('/changingPassword');
        } catch {}
    };

    const handleLogout = async () => {
        await requestApi('/auth/logout', 'GET');
        localStorage.removeItem('auth');
        navigate('/login');
    };

    return (
        <div className={cx('user-profile')}>
            <div className={cx('avatar-container')}>
                {user ? (
                    <>
                        {user.avatarUrl && (
                            <img src={process.env.REACT_APP_BASE_SERVER_URL + user.avatarUrl} alt="Avatar" />
                        )}
                    </>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
            <div className={cx('user-info')}>
                {!update && user ? (
                    <>
                        <div className={cx('user-info-line')}>
                            <strong>ID:</strong> {user.id}
                        </div>
                        <div className={cx('user-info-line')}>
                            <strong>Username:</strong> {user.username}
                        </div>
                        <div className={cx('user-info-line')}>
                            <strong>Full Name:</strong> {user.fullName}
                        </div>
                        <div className={cx('user-info-line')}>
                            <strong>Phone Number:</strong> {user.phoneNumber}
                        </div>
                        <div className={cx('user-info-line')}>
                            <strong>Email:</strong> {user.email}
                        </div>
                        <div className={cx('user-info-line')}>
                            <strong>Created At:</strong> {new Date(user.createdAt).toLocaleString()}
                        </div>
                        <button
                            className={cx('button-update-profile', 'button')}
                            onClick={() => {
                                handleUpdateprofile();
                            }}
                        >
                            Update Profile
                        </button>
                        <div className={cx('button-line')}>
                            <button
                                className={cx('button-change-password', 'button')}
                                onClick={() => {
                                    handleChangePassword();
                                }}
                            >
                                Change password
                            </button>
                            <button
                                className={cx('button-logout', 'button')}
                                onClick={() => {
                                    handleLogout();
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        {
                            <div className={cx('change-avatar-container')}>
                                {<h1> Change avatar</h1>}
                                <input
                                    className={cx('change-avatar-input')}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                                <button className={cx('change-avatar-button', 'button')} onClick={handleAvatarUpload}>
                                    Change Avatar
                                </button>
                            </div>
                        }
                        {
                            <div className={cx('update-profile-container')}>
                                <h1> Update profile</h1>

                                <form className={cx('form-wrapper')} onSubmit={handleSubmitFullName}>
                                    <div className={cx('full name', 'group-input')}>
                                        <label className={cx('full name-label', 'form-label')}>Full Name: </label>
                                        <div className={cx('input-submit')}>
                                            <input
                                                type="text"
                                                className={cx('input')}
                                                name="fullname"
                                                placeholder="Enter Full Name"
                                                value={fullname}
                                                onChange={(e) => setFullname(e.target.value)}
                                            />
                                            <button className={cx('submit-button', 'button')} type="submit">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                <form className={cx('form-wrapper')} onSubmit={handleSubmitPhonenumber}>
                                    <div className={cx('phone-number', 'group-input')}>
                                        <label className={cx('phone-number-label', 'form-label')}>Phone Number: </label>
                                        <div className={cx('input-submit')}>
                                            <input
                                                type="text"
                                                className={cx('input')}
                                                name="phonenumber"
                                                placeholder="Enter Phone Number"
                                                value={phonenumber}
                                                onChange={(e) => setPhonenumber(e.target.value)}
                                            />
                                            <button className={cx('submit-button', 'button')} type="submit">
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        }

                        {
                            <button className={cx('cancel-update-button', 'button')} onClick={handleCancelUpdate}>
                                Cancel update
                            </button>
                        }
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
