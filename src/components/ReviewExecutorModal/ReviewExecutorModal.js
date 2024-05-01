import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ReviewExecutorModal.module.scss';
import requestApi from '~/api/httpRequest';

const cx = classNames.bind(styles);
const auth = JSON.parse(localStorage.getItem('auth'));

const ReviewExecutorModal = ({ jobId, reviewType, onClose }) => {
    const [executors, setExecutors] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await requestApi(`/job-executor?order=DESC&jobId=${jobId}`, 'GET');
                const updatedExecutors = response.data.data.map((executor) => ({
                    ...executor,
                    formData: {
                        reviewerId: auth.userId,
                        revieweeId: executor.executor.id,
                        jobId: jobId,
                        content: '',
                        rating: '',
                        reviewType: reviewType,
                    },
                    file: [],
                }));
                setExecutors(updatedExecutors);
            } catch (error) {
                console.error('Error fetching applications:', error);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobId]);

    const handleExecutorChange = (index, e) => {
        const { name, value } = e.target;
        const updatedExecutors = [...executors];
        updatedExecutors[index].formData = {
            ...updatedExecutors[index].formData,
            [name]: value,
        };
        setExecutors(updatedExecutors);
    };

    const handleFileChange = (index, e) => {
        const files = Array.from(e.target.files);
        const updatedExecutors = [...executors];
        updatedExecutors[index].file = files;
        setExecutors(updatedExecutors);
    };

    const handleSubmit = async (index, e) => {
        e.preventDefault();
        try {
            const formDataWithFile = new FormData();
            const formData = executors[index].formData;

            formDataWithFile.append('reviewerId', formData.reviewerId);
            formDataWithFile.append('revieweeId', formData.revieweeId);
            formDataWithFile.append('jobId', formData.jobId);
            formDataWithFile.append('content', formData.content);
            formDataWithFile.append('rating', formData.rating);
            formDataWithFile.append('reviewType', formData.reviewType);

            if (executors[index].file) {
                executors[index].file.forEach((file) => {
                    formDataWithFile.append('files', file);
                });
            }

            const response = await requestApi('/reviews', 'POST', formDataWithFile);
            console.log(response.data);

            const updatedExecutors = [...executors];
            updatedExecutors[index].submitted = true;
            setExecutors(updatedExecutors);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className={cx('modalBackground')} onClick={onClose}>
            <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                <h2>List of executors</h2>
                {executors.map(
                    (jobEx, index) =>
                        !jobEx.submitted && (
                            <div className={cx('jobEx')} key={jobEx.id}>
                                <p>
                                    <b>Executor:</b> {jobEx.executor.fullName}
                                </p>
                                <p>
                                    <b>Email: </b>
                                    {jobEx.executor.email}
                                </p>
                                <p>
                                    <b>PhoneNumber: </b>
                                    {jobEx.executor.phoneNumber}
                                </p>
                                <form className={cx('review-form')} onSubmit={(e) => handleSubmit(index, e)}>
                                    <div>
                                        <label>
                                            <b>Rating:</b>
                                        </label>
                                        <div className={cx('rating-container')}>
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <div key={value} className={cx('rating-option')}>
                                                    <input
                                                        type="radio"
                                                        id={`rating-${value}-${index}`}
                                                        name={`rating`}
                                                        value={value}
                                                        checked={
                                                            jobEx.formData && jobEx.formData.rating === String(value)
                                                        }
                                                        onChange={(e) => handleExecutorChange(index, e)}
                                                    />
                                                    <label
                                                        htmlFor={`rating-${value}-${index}`}
                                                        className={cx('rating-label')}
                                                    >
                                                        {value}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor={`description-${index}`}>
                                            <b>Description: </b>
                                        </label>
                                        <textarea
                                            id={`description-${index}`}
                                            className={cx('description-pool')}
                                            name="content"
                                            value={jobEx.formData ? jobEx.formData.content : ''}
                                            onChange={(e) => handleExecutorChange(index, e)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor={`media-${index}`}>
                                            <b>Media: </b>
                                        </label>
                                        <input
                                            type="file"
                                            id={`media-${index}`}
                                            name="media"
                                            onChange={(e) => handleFileChange(index, e)}
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
                        ),
                )}
                <button className={cx('close-button')} onClick={() => onClose()}>
                    Close
                </button>
            </div>
        </div>
    );
};

ReviewExecutorModal.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default ReviewExecutorModal;
