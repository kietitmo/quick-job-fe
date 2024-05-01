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

    const handleChat = async () => {
        try {
        } catch (error) {}
    };

    return (
        <div className={cx('job-posted')}>
            <h3>Your applied jobs:</h3>
            <table className={cx('job-table')}>
                <thead>
                    <tr>
                        <th>Application Id</th>
                        <th>Created At</th>
                        <th>Application Status</th>
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
                    {applications.map((application) => (
                        <tr key={application.id}>
                            <td>{application.id}</td>
                            <td>{new Date(application.createdAt).toLocaleString()}</td>
                            <td>{application.status}</td>
                            <td>{application.job.title}</td>
                            <td>{application.job.quantityUserNeeded}</td>
                            <td>{new Date(application.job.startTime).toLocaleString()}</td>
                            <td>{new Date(application.job.endTime).toLocaleString()}</td>
                            <td>{application.job.salaryOrFee}</td>
                            <td>{application.job.category}</td>
                            <td>{application.job.status}</td>
                            <td>
                                {application.status !== 'COMPLETED' ? (
                                    <>
                                        <button
                                            className={cx('button-chat')}
                                            onClick={() => handleChat(application.id)}
                                        >
                                            Chat
                                        </button>
                                        <button
                                            className={cx('button-delete')}
                                            onClick={() => handleDeleteApplication(application.id)}
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    'COMPLETED'
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
        </div>
    );
};

export default ApplicationJob;
