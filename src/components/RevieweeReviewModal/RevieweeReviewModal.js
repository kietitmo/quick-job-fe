import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './RevieweeReviewModal.module.scss';
import requestApi from '~/api/httpRequest';
import ImageSlider from '../ImageSlider';

const cx = classNames.bind(styles);

const RevieweeReviewModal = ({ userId, reviewType, onClose }) => {
    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [modalContent, setModalContent] = useState(null);

    const calculateAverageRating = () => {
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            const average = totalRating / reviews.length;
            setAverageRating(average.toFixed(1));
        }
    };

    useEffect(() => {
        fetchReviews(userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId]);

    useEffect(() => {
        calculateAverageRating();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reviews]);

    const fetchReviews = async (userId) => {
        try {
            const response = await requestApi(
                `/reviews?order=DESC&revieweeId=${userId}&reviewType=${reviewType}`,
                'GET',
            );
            const reviews = response.data.data.map((review) => ({
                ...review,
                showMedia: review.media && review.media.length > 0, // Kiểm tra nếu có phương tiện
            }));
            setReviews(reviews);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
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

    return (
        <div className={cx('modalBackground')} onClick={onClose}>
            <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                <h2>Reviews</h2>
                <p className={cx('avg-rating')}>
                    <b>Average Rating: </b>
                    {averageRating}
                </p>
                {reviews.map((review) => (
                    <div className={cx('review')} key={review.id}>
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
                        {review.showMedia && ( // Chỉ hiển thị nút "Show Media" nếu có hình ảnh hoặc video
                            <button onClick={() => toggleMedia(review.id)}>Show Media</button>
                        )}
                    </div>
                ))}
                <button className={cx('close-button')} onClick={onClose}>
                    Close
                </button>
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
        </div>
    );
};

RevieweeReviewModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default RevieweeReviewModal;
