import PropTypes from 'prop-types';
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ReviewCreatorModal.module.scss';
import requestApi from '~/api/httpRequest';

const cx = classNames.bind(styles);
const auth = JSON.parse(localStorage.getItem('auth'));

const ReviewCreatorModal = ({ jobEx, reviewType, onClose }) => {
    const [formData, setFormData] = useState({
        reviewerId: auth.userId,
        revieweeId: jobEx.job.creator.id,
        jobId: jobEx.job.id,
        content: '',
        rating: '',
        reviewType: reviewType,
    });

    const [file, setFile] = useState([]); // Thêm state cho file

    const handleFormDataChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);

        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFile(files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataWithFile = new FormData();

            formDataWithFile.append('reviewerId', formData.reviewerId);
            formDataWithFile.append('revieweeId', formData.revieweeId);
            formDataWithFile.append('jobId', formData.jobId);
            formDataWithFile.append('content', formData.content);
            formDataWithFile.append('rating', formData.rating);
            formDataWithFile.append('reviewType', formData.reviewType);

            if (file) {
                file.forEach((file) => {
                    formDataWithFile.append('files', file);
                });
            }

            const response = await requestApi('/reviews', 'POST', formDataWithFile);
            console.log(response.data);
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className={cx('modalBackground')} onClick={onClose}>
            <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                <h2>Review job creator</h2>
                {
                    <>
                        <div className={cx('jobEx')} key={jobEx.id}>
                            <p>
                                <b>Creator:</b> {jobEx.job.creator.fullName}
                            </p>
                            <p>
                                <b>Email: </b>
                                {jobEx.job.creator.email}
                            </p>
                            <p>
                                <b>PhoneNumber: </b>
                                {jobEx.job.creator.phoneNumber}
                            </p>
                            <form className={cx('review-form')} onSubmit={handleSubmit}>
                                <div>
                                    <label>
                                        <b>Rating:</b>
                                    </label>
                                    <div className={cx('rating-container')}>
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <div key={value} className={cx('rating-option')}>
                                                <input
                                                    type="radio"
                                                    id={`rating`}
                                                    name={`rating`}
                                                    value={value}
                                                    checked={formData.rating === String(value)}
                                                    onChange={(e) => handleFormDataChange(e)}
                                                />
                                                <label htmlFor={`rating`} className={cx('rating-label')}>
                                                    {value}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor={`description`}>
                                        <b>Description: </b>
                                    </label>
                                    <textarea
                                        id={`description`}
                                        className={cx('description-pool')}
                                        name="content"
                                        value={formData.content}
                                        onChange={(e) => handleFormDataChange(e)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`media`}>
                                        <b>Media: </b>
                                    </label>
                                    <input
                                        type="file"
                                        id={`media}`}
                                        name="media"
                                        onChange={(e) => handleFileChange(e)}
                                        multiple
                                    />
                                </div>
                                <div>
                                    <button className={cx('submit-button')} type="submit">
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>

                        <button className={cx('close-button')} onClick={() => onClose()}>
                            Close
                        </button>
                    </>
                }
            </div>
        </div>
    );
};

ReviewCreatorModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default ReviewCreatorModal;
