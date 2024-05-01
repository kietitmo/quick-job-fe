import classNames from 'classnames/bind';
import styles from './UserProfile.module.scss';
import React, { useState, useEffect } from 'react';
import requestApi from '~/api/httpRequest';

const cx = classNames.bind(styles);

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null); // State để lưu trữ file ảnh đang được chọn

    const auth = JSON.parse(localStorage.getItem('auth'));

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

    // Hàm xử lý sự kiện khi chọn file ảnh mới
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
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

    return (
        <div className={cx('user-profile')}>
            <div className={cx('avatar-container')}>
                {user ? (
                    <>
                        {user.avatarUrl && (
                            <img src={process.env.REACT_APP_BASE_SERVER_URL + user.avatarUrl} alt="Avatar" />
                        )}
                        <input type="file" accept="image/*" onChange={handleFileChange} />
                        <button onClick={handleAvatarUpload}>Change Avatar</button>
                    </>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
            <div className={cx('user-info')}>
                {user ? (
                    <>
                        <div>
                            <strong>ID:</strong> {user.id}
                        </div>
                        <div>
                            <strong>Username:</strong> {user.username}
                        </div>
                        <div>
                            <strong>Email:</strong> {user.email}
                        </div>
                        <div>
                            <strong>Full Name:</strong> {user.fullName}
                        </div>
                        <div>
                            <strong>Phone Number:</strong> {user.phoneNumber}
                        </div>
                        <div>
                            <strong>Created At:</strong> {user.createdAt}
                        </div>
                    </>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
