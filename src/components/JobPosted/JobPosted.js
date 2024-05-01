import useAuth from '~/helper/auth/hooks/useAuth';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './JobPosted.module.scss';
import requestApi from '~/api/httpRequest';
import ApplicationsModal from '../ApplicationsModal';
import EditJobModal from '../EditJobModal';
import ReviewExecutorModal from '../ReviewExecutorModal/ReviewExecutorModal';

const cx = classNames.bind(styles);

const JobPosted = () => {
    const [jobs, setJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editedJob, setEditedJob] = useState(null); // State for edited job
    const [isEditing, setIsEditing] = useState(false); // State for modal visibility
    const { authFromContext } = useAuth(); // Get auth from context
    const [auth, setAuth] = useState(() => {
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : authFromContext;
    });

    const [selectedJob, setSelectedJob] = useState(null); // State for selected job
    const [selectedJobReview, setSelectedJobReview] = useState(null);

    // Open modal and set selected job when clicking on Application count
    const handleSelectJob = (job) => {
        setSelectedJob(job);
    };

    // Close modal
    const handleCloseModal = () => {
        setSelectedJob(null);
    };

    const handleSelectJobReview = (job) => {
        setSelectedJobReview(job);
    };

    const handleCloseModalReivew = () => {
        setSelectedJobReview(null);
    };
    // Open modal for editing job
    const handleOpenEditModal = (job) => {
        setEditedJob(job);
        setIsEditing(true);
    };

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
            const response = await requestApi(`/jobs?order=DESC&take=10&page=${page}&creatorId=${auth.userId}`, 'GET');
            setJobs(response.data.data);
            setTotalPages(response.data.meta.pageCount);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteJob = async (id) => {
        try {
            await requestApi(`/jobs/${id}`, 'DELETE');
            console.log('Deleted job: ' + id);
            fetchJobs(1);
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const handleUpdateJobStatusInProgress = async (id) => {
        try {
            await requestApi(`/jobs/${id}`, 'PATCH', { status: 'Progress' });
            console.log('Changed status to Completed of ' + id);
            const rp = await requestApi(`/applications?order=ASC&jobId=${id}`, 'GET');
            const apps = rp.data.data;
            apps.forEach((element) => {
                handleUpdateApplicationStatus(element.id, 'ACTIVE');
            });
            fetchJobs(1);
        } catch (error) {
            console.error('Error updating job status to In Progress:', error);
        }
    };

    const handleUpdateJobStatusSearching = async (id) => {
        try {
            await requestApi(`/jobs/${id}`, 'PATCH', { status: 'Searching' });
            console.log('Changed status to Progress of ' + id);
            const rp = await requestApi(`/applications?order=ASC&jobId=${id}`, 'GET');
            const apps = rp.data.data;
            apps.forEach((element) => {
                handleUpdateApplicationStatus(element.id, 'ACTIVE');
            });
            fetchJobs(1);
        } catch (error) {
            console.error('Error updating job status to In Progress:', error);
        }
    };

    const handleUpdateJobStatusCompleted = async (id) => {
        try {
            await requestApi(`/jobs/${id}`, 'PATCH', { status: 'Completed', endTime: new Date().toISOString() });
            console.log('Changed status to Completed of ' + id);
            const rp = await requestApi(`/applications?order=ASC&jobId=${id}`, 'GET');
            const apps = rp.data.data;
            apps.forEach((element) => {
                handleUpdateApplicationStatus(element.id, 'COMPLETED');
            });
            fetchJobs(1);
        } catch (error) {
            console.error('Error updating job status to Completed:', error);
        }
    };

    const handleUpdateApplicationStatus = async (id, status) => {
        try {
            await requestApi(`/applications/${id}`, 'PATCH', { status: status });
            console.log(`Changed status to ${status} of ` + id);
        } catch (error) {
            console.error(`Error updating job status to ${status}:`, error);
        }
    };

    return (
        <div className={cx('job-posted')}>
            <h3>Your posted jobs:</h3>
            <table className={cx('job-table')}>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Quantity Needed</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Salary/Fee</th>
                        <th>Category</th>
                        <th>Media count</th>
                        <th>Status</th>
                        <th>Applications</th>
                        <th>Action</th>
                        <th>TEST</th>
                    </tr>
                </thead>
                <tbody>
                    {jobs.map((job) => (
                        <tr key={job.id}>
                            <td>{job.title}</td>
                            <td>{job.description}</td>
                            <td>{job.quantityUserNeeded}</td>
                            <td>{new Date(job.startTime).toLocaleString()}</td>
                            <td>{new Date(job.endTime).toLocaleString()}</td>
                            <td>{job.salaryOrFee}</td>
                            <td>{job.category}</td>
                            <td>{job.images.length + job.videos.length}</td>
                            <td>{job.status}</td>
                            <td>
                                {job.status === 'Searching' ? (
                                    <button
                                        className={cx('button-application-count')}
                                        onClick={() => handleSelectJob(job)}
                                    >
                                        {job.applications.length}
                                    </button>
                                ) : (
                                    job.applications.length
                                )}
                            </td>
                            <td>
                                {job.status === 'Searching' && (
                                    <button
                                        className={cx('button-start')}
                                        onClick={() => handleUpdateJobStatusInProgress(job.id)}
                                    >
                                        Start
                                    </button>
                                )}
                                {job.status === 'Searching' && (
                                    <>
                                        <button className={cx('button-edit')} onClick={() => handleOpenEditModal(job)}>
                                            Edit
                                        </button>
                                        <button className={cx('button-delete')} onClick={() => handleDeleteJob(job.id)}>
                                            Delete
                                        </button>
                                    </>
                                )}
                                {job.status === 'Progress' && (
                                    <button
                                        className={cx('button-complete')}
                                        onClick={() => {
                                            handleUpdateJobStatusCompleted(job.id);
                                            handleSelectJobReview(job);
                                        }}
                                    >
                                        Complete
                                    </button>
                                )}
                                {job.status === 'Completed' && 'COMPLETED'}
                            </td>
                            <td>
                                <button
                                    className={cx('button-start')}
                                    onClick={() => handleUpdateJobStatusSearching(job.id)}
                                >
                                    Searching
                                </button>

                                <button
                                    className={cx('button-start')}
                                    onClick={() => handleUpdateJobStatusInProgress(job.id)}
                                >
                                    Start
                                </button>
                                <button
                                    className={cx('button-complete')}
                                    onClick={() => {
                                        handleUpdateJobStatusCompleted(job.id);
                                        handleSelectJobReview(job);
                                    }}
                                >
                                    Complete
                                </button>
                                <button className={cx('button-delete')} onClick={() => handleDeleteJob(job.id)}>
                                    Delete
                                </button>
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
            {isEditing && <EditJobModal job={editedJob} onClose={() => setIsEditing(false)} />}
            {/* Render modal for applications */}
            {selectedJob && <ApplicationsModal job={selectedJob} onClose={handleCloseModal} />}
            {selectedJobReview && (
                <ReviewExecutorModal
                    jobId={selectedJobReview.id}
                    reviewType={'CREATOR_TO_EXECUTOR'}
                    onClose={handleCloseModalReivew}
                />
            )}
        </div>
    );
};

export default JobPosted;
