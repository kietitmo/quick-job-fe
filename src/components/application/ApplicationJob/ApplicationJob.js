import useAuth from '~/helper/auth/hooks/useAuth';

import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ApplicationJob.module.scss';
import requestApi from '~/api/httpRequest';

const cx = classNames.bind(styles);

const ApplicationJob = () => {
    const [applications, setApplications] = useState([]);
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
            fetchApplications(currentPage);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, auth]);

    const fetchActualApplications = async () => {
        try {
            const response = await requestApi(
                `/applications?order=DESC&status=ACTIVE&applicantId=${auth.userId}`, //
                'GET',
            );
            setApplications(response.data.data);
            setTotalPages(response.data.meta.pageCount);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchConmpletedApplications = async (page) => {
        try {
            const response = await requestApi(
                `/applications?order=DESC&status=COMPLETED&applicantId=${auth.userId}`, //
                'GET',
            );
            setApplications(response.data.data);
            setTotalPages(response.data.meta.pageCount);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchApplications = async (page) => {
        try {
            const response = await requestApi(
                `/applications?order=DESC&take=10&page=${page}&applicantId=${auth.userId}`, //
                'GET',
            );
            setApplications(response.data.data);
            setTotalPages(response.data.meta.pageCount);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteApplication = async (id) => {
        try {
            await requestApi(`/applications/${id}`, 'DELETE');
            console.log('Deleted Application: ' + id);
            fetchApplications(1);
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    return (
        <div className={cx('applications-applied')}>
            <div>
                <button className={cx('button')} onClick={() => fetchApplications(currentPage)}>
                    All applications
                </button>
                <button className={cx('button')} onClick={() => fetchActualApplications()}>
                    Actual
                </button>
                <button className={cx('button')} onClick={() => fetchConmpletedApplications()}>
                    Completed
                </button>
            </div>
            {applications.length > 0 ? (
                <div className={cx('applications')}>
                    {applications.map((application) => (
                        <div className={cx('application')} key={application.id}>
                            <div>
                                <b>Title: </b>
                                {application.job.title}
                            </div>
                            <div>
                                <b>Status: </b>
                                {application.status}
                            </div>

                            <div>
                                <b>Start at: </b>
                                {new Date(application.job.startTime).toLocaleString()}
                            </div>
                            <div>
                                <b>Fee: </b>
                                {application.job.salaryOrFee}
                            </div>
                            <div>
                                <b>Category: </b>
                                {application.job.category}
                            </div>
                            <div>
                                <b>Applied at: </b> {new Date(application.createdAt).toLocaleString()}
                            </div>
                            <div>
                                {application.status !== 'COMPLETED' ? (
                                    <button
                                        className={cx('button-delete')}
                                        onClick={() => handleDeleteApplication(application.id)}
                                    >
                                        Cancel
                                    </button>
                                ) : (
                                    'COMPLETED'
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <h1>You dont have any job!</h1>
            )}

            <div className={cx('pagination')}>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button key={page} onClick={() => handlePageChange(page)}>
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ApplicationJob;
