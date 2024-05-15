import useAuth from '~/helper/auth/hooks/useAuth';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './JobPosted.module.scss';
import requestApi from '~/api/httpRequest';
import ApplicationsModal from '~/components/application/ApplicationsModal';
import EditJobModal from '~/components/job/EditJobModal';
import ReviewExecutorModal from '~/components/review/ReviewExecutorModal/ReviewExecutorModal';
import JobDetail from '~/components/job/JobDetail';

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
    const [selectedJobDetail, setSelectedJobDetail] = useState(null); // State for selected job

    const [selectedJobReview, setSelectedJobReview] = useState(null);

    // Open modal and set selected job when clicking on Application count
    const handleSelectJob = (job) => {
        setSelectedJob(job);
    };

    // Close modal
    const handleCloseModal = () => {
        setSelectedJob(null);
    };

    const handleSelectJobDetail = (job) => {
        setSelectedJobDetail(job);
    };

    // Close modal
    const handleCloseModalDetail = () => {
        setSelectedJobDetail(null);
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

    const fetchCompletedJobs = async () => {
        try {
            const response = await requestApi(`/jobs?order=DESC&status=Completed&creatorId=${auth.userId}`, 'GET');
            setJobs(response.data.data);
            setTotalPages(response.data.meta.pageCount);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchProcessJobs = async () => {
        try {
            const response = await requestApi(`/jobs?order=DESC&status=Progress&creatorId=${auth.userId}`, 'GET');
            setJobs(response.data.data);
            setTotalPages(response.data.meta.pageCount);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const fetchSearchingJobs = async () => {
        try {
            const response = await requestApi(`/jobs?order=DESC&status=Searching&creatorId=${auth.userId}`, 'GET');
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

    // const handleUpdateJobStatusSearching = async (id) => {
    //     try {
    //         await requestApi(`/jobs/${id}`, 'PATCH', { status: 'Searching' });
    //         console.log('Changed status to Progress of ' + id);
    //         const rp = await requestApi(`/applications?order=ASC&jobId=${id}`, 'GET');
    //         const apps = rp.data.data;
    //         apps.forEach((element) => {
    //             handleUpdateApplicationStatus(element.id, 'ACTIVE');
    //         });
    //         fetchJobs(1);
    //     } catch (error) {
    //         console.error('Error updating job status to In Progress:', error);
    //     }
    // };

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

    const handleActualjob = async () => {
        fetchCompletedJobs();
    };

    return (
        <div className={cx('job-posted')}>
            {
                <div>
                    <button className={cx('button')} onClick={() => fetchJobs(currentPage)}>
                        All jobs
                    </button>
                    <button className={cx('button')} onClick={() => fetchSearchingJobs()}>
                        Searching
                    </button>
                    <button className={cx('button')} onClick={() => fetchProcessJobs()}>
                        Jobs in process
                    </button>
                    <button className={cx('button')} onClick={() => handleActualjob()}>
                        Completed jobs
                    </button>
                </div>
            }

            {jobs.length > 0 ? (
                <div className={cx('job-table')}>
                    {jobs.map((job, index) => (
                        <div className={cx('job')} key={job.id}>
                            <div className={cx('job-info-container')}>
                                <div className={cx('job-info')}>
                                    <b>Title: </b> {job.title}
                                </div>
                                <div className={cx('job-info')}>
                                    <b>Status: </b>
                                    {job.status}
                                </div>

                                <div className={cx('buttons-info')}>
                                    <div>
                                        {job.status === 'Searching' ? (
                                            <button
                                                className={cx('button-application-count', 'button')}
                                                onClick={() => handleSelectJob(job)}
                                            >
                                                Applicants: {job.applications.length}
                                            </button>
                                        ) : (
                                            <div className={cx('job-info')}>
                                                <b>Applicants: </b>
                                                {job.applications.length}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <button
                                            className={cx('button-job-detail', 'button')}
                                            onClick={() => handleSelectJobDetail(job)}
                                        >
                                            Detail
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className={cx('buttons-line')}>
                                {job.status === 'Searching' && (
                                    <button
                                        className={cx('button-start', 'button')}
                                        onClick={() => handleUpdateJobStatusInProgress(job.id)}
                                    >
                                        Start
                                    </button>
                                )}
                                {job.status === 'Searching' && (
                                    <>
                                        <button
                                            className={cx('button-edit', 'button')}
                                            onClick={() => handleOpenEditModal(job)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className={cx('button-delete', 'button')}
                                            onClick={() => handleDeleteJob(job.id)}
                                        >
                                            Delete
                                        </button>
                                    </>
                                )}
                                {job.status === 'Progress' && (
                                    <button
                                        className={cx('button-complete', 'button')}
                                        onClick={() => {
                                            handleUpdateJobStatusCompleted(job.id);
                                            handleSelectJobReview(job);
                                        }}
                                    >
                                        Complete
                                    </button>
                                )}
                                {job.status === 'Completed' && <div className={cx('completed')}> JOB IS COMPLETED</div>}
                            </div>
                            {/* <div className={cx('button-test')}>
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
                            </div> */}
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
            {selectedJobDetail && (
                <JobDetail key={selectedJobDetail.id} props={selectedJobDetail} onClose={handleCloseModalDetail} />
            )}
        </div>
    );
};

export default JobPosted;
