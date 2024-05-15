import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './ApplicationsModal.module.scss';
import requestApi from '~/api/httpRequest';
import RevieweeReviewModal from '~/components/review/RevieweeReviewModal';

const cx = classNames.bind(styles);

const ApplicationsModal = ({ job, onClose }) => {
    const [applications, setApplications] = useState([]);
    const [chosenApplications, setChosenApplications] = useState([]);
    const [selectedApplicant, setSelectedApplicant] = useState(null); // State for selected job

    useEffect(() => {
        fetchApps(job);
    }, [job]);

    const fetchApps = async (job) => {
        try {
            const response = await requestApi(`/applications?order=DESC&jobId=${job.id}`, 'GET');
            const appsWithJobExecutorIds = await Promise.all(
                response.data.data.map(async (application) => {
                    try {
                        const jobExecutorResponse = await requestApi(
                            `/job-executor?order=DESC&applicationId=${application.id}`,
                            'GET',
                        );
                        const jobExecutors = jobExecutorResponse.data.data;
                        const jobExecutorId = jobExecutors.length > 0 ? jobExecutors[0].id : null;
                        return { ...application, jobExecutorId };
                    } catch (error) {
                        console.error('Error fetching job executor:', error);
                        return { ...application, jobExecutorId: null };
                    }
                }),
            );
            setApplications(appsWithJobExecutorIds);
        } catch (error) {
            console.error('Error fetching applications:', error);
        }
    };

    useEffect(() => {
        const fetchChosenStatus = async () => {
            const chosenStatuses = await Promise.all(
                applications.map(async (application) => {
                    try {
                        const response = await requestApi(
                            `/job-executor?order=DESC&applicationId=${application.id}`,
                            'GET',
                        );
                        return response.data.data.length > 0;
                    } catch (error) {
                        console.error('Error checking if application is chosen:', error);
                        return false;
                    }
                }),
            );
            setChosenApplications(chosenStatuses);
        };

        fetchChosenStatus();
    }, [applications]);

    const handleChooseApplication = async (applicationId, applicantId) => {
        try {
            await requestApi('/job-executor', 'POST', {
                jobId: job.id,
                applicationId: applicationId,
                executorId: applicantId,
            });
            fetchApps(job);
        } catch (error) {
            console.error('Error choosing application:', error);
        }
    };

    const handleDeleteChoose = async (jobExecutorId) => {
        try {
            console.log('deleted job-executor', jobExecutorId);
            await requestApi(`/job-executor/${jobExecutorId}`, 'DELETE');
            fetchApps(job);
        } catch (error) {
            console.error('Error deleting chosen application:', error);
        }
    };

    const handleSelectApp = (userId) => {
        setSelectedApplicant(userId);
    };

    // Close modal
    const handleCloseModal = () => {
        setSelectedApplicant(null);
    };

    return (
        <div className={cx('modalBackground')} onClick={onClose}>
            <div className={cx('modalContent')} onClick={(e) => e.stopPropagation()}>
                <h2>Applicants: </h2>
                {applications.map((application, index) => (
                    <div className={cx('application')} key={application.id}>
                        {application.applicant.avatarUrl ? (
                            <img
                                className={cx('avatar')}
                                src={process.env.REACT_APP_BASE_SERVER_URL + application.applicant.avatarUrl}
                                alt="Avatar"
                            />
                        ) : (
                            <img className={cx('avatar')} src={'/photos/default-avatar.png'} alt="Avatar" />
                        )}

                        <div className={cx('applicant-infor')}>
                            <p>Status: {application.status}</p>
                            <p>Applicant: {application.applicant.fullName}</p>
                            <p>Email: {application.applicant.email}</p>
                            <p>PhoneNumber: {application.applicant.phoneNumber}</p>
                            {
                                <button
                                    className={cx('button-show-review')}
                                    onClick={() => handleSelectApp(application.applicant.id)}
                                >
                                    Show reviews
                                </button>
                            }
                            {chosenApplications[index] ? (
                                <button onClick={() => handleDeleteChoose(application.jobExecutorId)}>
                                    Delete Choose
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleChooseApplication(application.id, application.applicant.id)}
                                >
                                    Choose
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <button className={cx('button-close')} onClick={onClose}>
                    Close
                </button>
            </div>
            {selectedApplicant && (
                <RevieweeReviewModal
                    userId={selectedApplicant}
                    reviewType={'CREATOR_TO_EXECUTOR'}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

ApplicationsModal.propTypes = {
    job: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default ApplicationsModal;
