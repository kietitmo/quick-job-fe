import useAuth from '~/helper/auth/hooks/useAuth';

import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ReceivedJob.module.scss';
import requestApi from '~/api/httpRequest';
import ReviewCreatorModal from '../ReviewCreatorModal';

const cx = classNames.bind(styles);

const ReceivedJob = () => {
    const [jobExecutors, setJobExecutors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { authFromContext } = useAuth(); // Lấy auth từ context
    const [auth, setAuth] = useState(() => {
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : authFromContext;
    });

    useEffect(() => {
        if (!auth) {
            setAuth(authFromContext);
            localStorage.setItem('auth', JSON.stringify(authFromContext));
        }
    }, [auth, authFromContext]);

    useEffect(() => {
        if (auth) {
            fetchJobs(currentPage);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, auth]);

    const fetchJobs = async (page) => {
        try {
            const response = await requestApi(
                `/job-executor?order=DESC&take=10&page=${page}&executorId=${auth.userId}`, //
                'GET',
            );
            const jobExecutorsWithReviewStatus = await Promise.all(
                response.data.data.map(async (jobEx) => {
                    const reviewResponse = await requestApi(
                        `/reviews?order=DESC&revieweeId=${jobEx.job.creator.id}&reviewerId=${auth.userId}&jobId=${jobEx.job.id}`,
                        'GET',
                    );
                    console.log(reviewResponse.data.data);
                    return {
                        ...jobEx,
                        reviewed: reviewResponse.data.data.length > 0,
                    };
                }),
            );
            setJobExecutors(jobExecutorsWithReviewStatus);
            setTotalPages(response.data.meta.pageCount);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleChat = async () => {
        try {
        } catch (error) {}
    };

    const [selectedJobExecutor, setSelectedJobExecutor] = useState(null); // State for selected job
    const handleSelectJob = (job) => {
        setSelectedJobExecutor(job);
    };

    // Close modal
    const handleCloseModal = () => {
        setSelectedJobExecutor(null);
    };

    return (
        <div className={cx('job-received')}>
            <h3>Your received jobs:</h3>
            <table className={cx('job-table')}>
                <thead>
                    <tr>
                        <th>Job Title</th>
                        <th>Need</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Salary/Fee</th>
                        <th>Category</th>
                        <th>Job Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {jobExecutors.map((jobEx) => (
                        <tr key={jobEx.id}>
                            <td>{jobEx.job.title}</td>
                            <td>{jobEx.job.quantityUserNeeded}</td>
                            <td>{new Date(jobEx.job.startTime).toLocaleString()}</td>
                            <td>{new Date(jobEx.job.endTime).toLocaleString()}</td>
                            <td>{jobEx.job.salaryOrFee}</td>
                            <td>{jobEx.job.category}</td>
                            <td>{jobEx.job.status}</td>
                            <td>
                                {jobEx.job.status !== 'Completed' && (
                                    <button className={cx('button-chat')} onClick={() => handleChat(jobEx.id)}>
                                        Chat
                                    </button>
                                )}
                                {console.log(jobEx.reviewed)}
                                {jobEx.job.status === 'Completed' && jobEx.reviewed && <span>Reviewed</span>}
                                {jobEx.job.status === 'Completed' && !jobEx.reviewed && (
                                    <button
                                        className={cx('button-Give-a-feedbaack')}
                                        onClick={() => handleSelectJob(jobEx)}
                                    >
                                        review
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={cx('pagination')}>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button key={page} onClick={() => handlePageChange(page)}>
                        {page}
                    </button>
                ))}
            </div>
            {selectedJobExecutor && (
                <ReviewCreatorModal
                    jobEx={selectedJobExecutor}
                    reviewType={'EXECUTOR_TO_CREATOR'}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default ReceivedJob;
