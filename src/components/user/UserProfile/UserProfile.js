import classNames from 'classnames/bind';
import styles from './UserProfile.module.scss';
import React, { useState, useEffect } from 'react';
import requestApi from '~/api/httpRequest';
import { useNavigate } from 'react-router-dom';
import ImageSlider from '~/components/general/ImageSlider';

const cx = classNames.bind(styles);

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [update, setUpdate] = useState(false);
    const [emailSubmited, setEmailSubmit] = useState(false);
    const [fullname, setFullname] = useState('');
    const [phonenumber, setPhonenumber] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [modalContent, setModalContent] = useState(null);

    const auth = JSON.parse(localStorage.getItem('auth'));
    const navigate = useNavigate();

    const [reivewToggle, setReivewToggle] = useState(false);
    const [reviews, setReviews] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

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

    useEffect(() => {
        const fetchUserData = async (page) => {
            try {
                const response = await requestApi(
                    `reviews?order=DESC&take=6&page=${page}&revieweeId=${auth.userId}`,
                    'GET',
                );
                setReviews(response.data.data);
                console.log(response.data.data);
                setTotalPages(response.data.meta.pageCount);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData(currentPage);
    }, [auth.userId, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

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
            window.location.reload();
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
            window.location.reload();
        } catch (error) {
            console.error('Error updating phone number:', error);
            alert('Failed to update phone number. Please try again.');
        }
    };

    const handleSubmitEmail = async (e) => {
        e.preventDefault();
        try {
            const response = await requestApi('/auth/change-Email', 'POST', { newEmail: email });
            console.log(response);
            setEmailSubmit(true);
        } catch (error) {
            console.error('Error updating phone number:', error);
            alert('Failed to update phone number. Please try again.');
        }
    };

    const handleSubmitToken = async (e) => {
        e.preventDefault();
        try {
            await requestApi('/auth/verify-change-Email', 'POST', {
                currentEmail: user.email,
                newEmail: email,
                emailToken: token,
            });
            window.location.reload();
        } catch (error) {
            console.error('Error updating email:', error);
            alert('Failed to update email. Please try again.');
        }
    };

    const handleCancelUpdate = async () => {
        setUpdate(false);
        if (emailSubmited) {
            await requestApi('/auth/cancel-change-Email', 'POST');
            setEmailSubmit(false);
        }
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
            window.location.reload();
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

    const handleReviews = async () => {
        setReivewToggle(true);
    };

    const toggleMedia = (reviewId) => {
        const review = reviews.find((review) => review.id === reviewId);
        if (review) {
            setModalContent({
                images: review.media.filter((media) => media.mediaType === 'IMAGE'),
                videos: review.media.filter((media) => media.mediaType === 'VIDEO'),
            });
        }
    };

    const closeModal = () => {
        setModalContent(null);
    };

    const closeReviews = () => {
        setReivewToggle(false);
    };

    return (
        <div className={cx('user-profile')}>
            {user && !reivewToggle ? (
                <>
                    <div className={cx('avatar-container')}>
                        <>
                            {user.avatarUrl ? (
                                <img src={process.env.REACT_APP_BASE_SERVER_URL + user.avatarUrl} alt="Avatar" />
                            ) : (
                                <div>
                                    <img
                                        className={cx('component-container-gif')}
                                        src={'/gif/avatar.gif'}
                                        alt="Avatar"
                                    />
                                </div>
                            )}
                        </>
                    </div>
                    <div className={cx('user-info')}>
                        {!update && user ? (
                            <>
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

                                <div className={cx('button-line')}>
                                    <button
                                        className={cx('button-update-profile', 'button')}
                                        onClick={() => {
                                            handleUpdateprofile();
                                        }}
                                    >
                                        Update Profile
                                    </button>
                                    <button
                                        className={cx('button-change-password', 'button')}
                                        onClick={() => {
                                            handleChangePassword();
                                        }}
                                    >
                                        Change password
                                    </button>
                                    <button
                                        className={cx('button-reivew', 'button')}
                                        onClick={() => {
                                            handleReviews();
                                        }}
                                    >
                                        Show your review
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {!emailSubmited && (
                                    <div className={cx('change-avatar-container')}>
                                        {<h1> Change avatar</h1>}
                                        <input
                                            className={cx('change-avatar-input')}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                        />
                                        <button
                                            className={cx('change-avatar-button', 'button')}
                                            onClick={handleAvatarUpload}
                                        >
                                            Change Avatar
                                        </button>
                                    </div>
                                )}
                                {!emailSubmited ? (
                                    <div className={cx('update-profile-container')}>
                                        <h1> Update profile</h1>

                                        <>
                                            <form className={cx('form-wrapper')} onSubmit={handleSubmitFullName}>
                                                <div className={cx('full name', 'group-input')}>
                                                    <label className={cx('full name-label', 'form-label')}>
                                                        Full Name:{' '}
                                                    </label>
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
                                                    <label className={cx('phone-number-label', 'form-label')}>
                                                        Phone Number:{' '}
                                                    </label>
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

                                            <form className={cx('form-wrapper')} onSubmit={handleSubmitEmail}>
                                                <div className={cx('email', 'group-input')}>
                                                    <label className={cx('email-label', 'form-label')}>Email: </label>
                                                    <div className={cx('input-submit')}>
                                                        <input
                                                            type="text"
                                                            className={cx('input')}
                                                            name="email"
                                                            placeholder="Enter new email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                        />
                                                        <button className={cx('submit-button', 'button')} type="submit">
                                                            Submit
                                                        </button>
                                                    </div>
                                                </div>
                                            </form>
                                        </>
                                    </div>
                                ) : (
                                    <form className={cx('form-wrapper')} onSubmit={handleSubmitToken}>
                                        <div className={cx('token', 'group-input')}>
                                            <label className={cx('token-label', 'form-label')}>
                                                Token in your email:{' '}
                                            </label>
                                            <div className={cx('input-submit')}>
                                                <input
                                                    type="text"
                                                    className={cx('input')}
                                                    name="token"
                                                    placeholder="Enter token"
                                                    value={token}
                                                    onChange={(e) => setToken(e.target.value)}
                                                />
                                                <button className={cx('submit-button', 'button')} type="submit">
                                                    Submit
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                )}

                                {
                                    <button
                                        className={cx('cancel-update-button', 'button')}
                                        onClick={handleCancelUpdate}
                                    >
                                        Cancel update
                                    </button>
                                }
                            </>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <button className={cx('back-button')} onClick={() => closeReviews()}>
                        Back to profile
                    </button>

                    <div className={cx('reviews')}>
                        {reviews.map((review) => (
                            <div className={cx('review')} key={review.id}>
                                <img
                                    className={cx('avatar')}
                                    src={process.env.REACT_APP_BASE_SERVER_URL + review.reviewer.avatarUrl}
                                    alt="Avatar"
                                />
                                <div className={cx('reviewer-infor')}>
                                    <p>
                                        <b>Reviewer: </b>
                                        {review.reviewer.email}
                                    </p>
                                    <p>
                                        <b>created at: </b>
                                        {new Date(review.createdAt).toLocaleString()}
                                    </p>
                                    <p>
                                        <b>Rating: </b>
                                        {review.rating}
                                    </p>
                                    <p>
                                        <b>Description: </b>
                                        {review.content}
                                    </p>
                                    {review.media.length > 0 && ( // Chỉ hiển thị nút "Show Media" nếu có hình ảnh hoặc video
                                        <button onClick={() => toggleMedia(review.id)}>Show Media</button>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div className={cx('pagination')}>
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                                <button key={page} onClick={() => handlePageChange(page)}>
                                    {page}
                                </button>
                            ))}
                        </div>
                    </div>

                    {modalContent && (
                        <div className={cx('modalBackground')} onClick={closeModal}>
                            <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                                {modalContent.images && <ImageSlider mediaItems={modalContent.images} />}
                                {modalContent.videos &&
                                    modalContent.videos.map((video, index) => (
                                        <div key={index}>
                                            <video controls style={{ maxWidth: '100%', height: 'auto' }}>
                                                <source
                                                    src={process.env.REACT_APP_BASE_SERVER_URL + video.url}
                                                    type={video.type}
                                                />
                                                Your browser does not support the video tag.
                                            </video>
                                        </div>
                                    ))}

                                <button className={cx('close-button')} onClick={closeModal}>
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UserProfile;
