import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ReviewModal.module.scss';
import requestApi from '~/api/httpRequest';

const cx = classNames.bind(styles);
const auth = JSON.parse(localStorage.getItem('auth'));

const ReviewModal = ({ job, reviewerId, revieweeId, reviewType, onClose }) => {
    const [formData, setFormData] = useState({
        reviewerId: reviewerId,
        revieweeId: revieweeId,
        jobId: job.id,
        content: '',
        rating: '', // Changed to string for the value
        reviewType: reviewType,
    });
    const [file, setFile] = useState([]); // Thêm state cho file

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFile(files);
    };

    const clearSelectedFiles = () => {
        setFile([]); // Xóa mảng các file đã chọn
        const input = document.getElementById('media');
        if (input) {
            input.value = ''; // Xóa giá trị của input file để reset nó
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataWithFile = new FormData();
            formDataWithFile.append('reviewerId', auth.userId);
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
            console.log(response.data); // Xử lý response nếu cần

            clearSelectedFiles();
            // Your submit logic here
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className={cx('edit-job-modal')}>
            <form className={cx('edit-job-form')} onSubmit={handleSubmit}>
                <div>
                    <label>Rating:</label>
                    <div className={cx('rating-container')}>
                        {[1, 2, 3, 4, 5].map((value) => (
                            <div key={value} className={cx('rating-option')}>
                                <input
                                    type="radio"
                                    id={`rating-${value}`}
                                    name="rating"
                                    value={String(value)} // Convert to string
                                    checked={formData.rating === String(value)} // Check if equal to string value
                                    onChange={handleChange}
                                />
                                <label htmlFor={`rating-${value}`} className={cx('rating-label')}>
                                    {value}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="content"
                        value={formData.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="media">Media:</label>
                    <input type="file" id="media" name="media" onChange={handleFileChange} multiple />
                </div>
                <div>
                    <button type="submit">Submit</button>
                    <button className={cx('close-button')} onClick={() => onClose()}>
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewModal;
