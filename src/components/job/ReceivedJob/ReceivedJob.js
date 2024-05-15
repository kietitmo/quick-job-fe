import useAuth from '~/helper/auth/hooks/useAuth';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ReceivedJob.module.scss';
import requestApi from '~/api/httpRequest';
import ReviewCreatorModal from '~/components/review/ReviewCreatorModal';

const cx = classNames.bind(styles);

const ReceivedJob = () => {
    const { authFromContext } = useAuth();
    const [auth, setAuth] = useState(() => {
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : authFromContext;
    });
    const [jobExecutors, setJobExecutors] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedJobExecutor, setSelectedJobExecutor] = useState(null);

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

    const handleSelectJob = (job) => {
        setSelectedJobExecutor(job);
    };

    const handleCloseModal = () => {
        setSelectedJobExecutor(null);
    };

    const fetchReviewedJobs = async () => {
        try {
            const response = await requestApi(
                `/job-executor?order=DESC&executorId=${auth.userId}`, //
                'GET',
            );
            const jobExecutorsWithReviewStatus = await Promise.all(
                response.data.data.map(async (jobEx) => {
                    const reviewResponse = await requestApi(
                        `/reviews?order=DESC&revieweeId=${jobEx.job.creator.id}&reviewerId=${auth.userId}&jobId=${jobEx.job.id}`,
                        'GET',
                    );
                    return {
                        ...jobEx,
                        reviewed: reviewResponse.data.data.length > 0,
                    };
                }),
            );

            setJobExecutors(jobExecutorsWithReviewStatus.filter((x) => x.reviewed === true));
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchNotYetReviewedJobs = async () => {
        try {
            const response = await requestApi(
                `/job-executor?order=DESC&executorId=${auth.userId}`, //
                'GET',
            );
            const jobExecutorsWithReviewStatus = await Promise.all(
                response.data.data.map(async (jobEx) => {
                    const reviewResponse = await requestApi(
                        `/reviews?order=DESC&revieweeId=${jobEx.job.creator.id}&reviewerId=${auth.userId}&jobId=${jobEx.job.id}`,
                        'GET',
                    );
                    return {
                        ...jobEx,
                        reviewed: reviewResponse.data.data.length > 0,
                    };
                }),
            );

            setJobExecutors(jobExecutorsWithReviewStatus.filter((x) => x.reviewed === false));
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    return (
        <div className={cx('job-received')}>
            <div>
                <button className={cx('button')} onClick={() => fetchJobs(currentPage)}>
                    All job
                </button>
                <button className={cx('button')} onClick={() => fetchReviewedJobs()}>
                    Reviewed
                </button>
                <button className={cx('button')} onClick={() => fetchNotYetReviewedJobs()}>
                    Non-reviewed
                </button>
            </div>
            {jobExecutors.length > 0 ? (
                <div className={cx('jobs')}>
                    {jobExecutors.map((jobEx) => (
                        <div className={cx('job')} key={jobEx.id}>
                            <div>
                                <b>Title: </b>
                                {jobEx.job.title}
                            </div>
                            <div>
                                <b>Start at: </b>
                                {new Date(jobEx.job.startTime).toLocaleString()}
                            </div>
                            <div>
                                <b>Fee: </b>
                                {jobEx.job.salaryOrFee}
                            </div>
                            <div>
                                <b>Category: </b>
                                {jobEx.job.category}
                            </div>
                            <div>
                                <b>Status: </b>
                                {jobEx.job.status}
                            </div>
                            <div>
                                <b>Actions: </b>
                                {jobEx.job.status !== 'Completed' && <span>No-action</span>}
                                {jobEx.job.status === 'Completed' && jobEx.reviewed && <span>Reviewed</span>}
                                {jobEx.job.status === 'Completed' && !jobEx.reviewed && (
                                    <button
                                        className={cx('button-Give-a-feedbaack')}
                                        onClick={() => handleSelectJob(jobEx)}
                                    >
                                        Review
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <h1>You do not have any job!</h1>
            )}
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
