import styles from './Post.module.scss';
import classNames from 'classnames/bind';
import requestApi from '~/api/httpRequest';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faLocationDot,
    faClock,
    faMoneyBill1,
    faPerson,
    faLayerGroup,
    faSignalPerfect,
    faEnvelope,
    faPhoneVolume,
} from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import ImageSlider from '../ImageSlider';
import Description from './Description';
import useAuth from '~/helper/auth/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import RevieweeReviewModal from '../RevieweeReviewModal';

const cx = classNames.bind(styles);
const Post = (props) => {
    const { auth } = useAuth();
    const [applied, setApplied] = useState(false);
    const [applicationId, setApplicationId] = useState(null);
    const [selectedCreator, setSelectedCreator] = useState(null); // State for selected job
    const [contact, setContact] = useState(false);

    const navigate = useNavigate();
    const handleSelectCreator = (userId) => {
        setSelectedCreator(userId);
    };

    // Close modal
    const handleCloseModal = () => {
        setSelectedCreator(null);
    };
    useEffect(() => {
        async function checkIfApplied() {
            if (auth && auth.tokens) {
                try {
                    const response = await requestApi(
                        `/applications?order=DESC&jobId=${props.id}&applicantId=${auth.userId}`, //
                        'GET',
                    );
                    const applications = response.data.data;
                    const isApplied = applications.some((application) => application.job.id === props.id);
                    if (isApplied) {
                        const appliedApplication = applications.find((application) => application.job.id === props.id);
                        setApplied(true);
                        setApplicationId(appliedApplication.id); // Lưu applicationId của ứng dụng đã apply
                    }
                } catch (error) {
                    console.error('Error fetching applications:', error);
                }
            }
        }
        checkIfApplied();
    }, [auth, props.id]);

    const handleApply = async () => {
        if (auth && auth.tokens) {
            const data = {
                applicantId: auth.userId,
                jobId: props.id,
            };
            try {
                const response = await requestApi('/applications', 'POST', data);
                setApplied(true); // Đặt trạng thái đã apply thành true sau khi thành công
                const application = response.data;
                setApplicationId(application.id);
            } catch (error) {
                console.error('Error creating application:', error);
            }
        } else {
            navigate('/login');
        }
    };

    const handleDeleteApply = async () => {
        try {
            await requestApi(`/applications/${applicationId}`, 'DELETE');
            setApplied(false); // Đặt trạng thái đã apply thành false sau khi xóa ứng dụng
            setApplicationId(); // Xóa applicationId khỏi state sau khi xóa ứng dụng
        } catch (error) {
            console.error('Error deleting application:', error);
        }
    };

    const handleContact = () => {
        setContact(!contact);
    };
    return (
        <div className={cx('post')}>
            <div className={cx('post-header')}>
                <div className={cx('post-title')}>{props.title}</div>
                <div className={cx('author')}>
                    <div className={cx('author-infor')}>
                        <p className={cx('author-name')} onClick={() => handleSelectCreator(props.creator.id)}>
                            {props.creator.fullName}
                        </p>
                        <p className={cx('post-time')}>{new Date(props.postedTime).toLocaleString()}</p>
                    </div>
                    {props.creator.avatarUrl ? (
                        <img
                            src={process.env.REACT_APP_BASE_SERVER_URL + props.creator.avatarUrl}
                            alt={props.creator.fullName}
                            className={cx('avatar')}
                            onClick={() => handleSelectCreator(props.creator.id)}
                        />
                    ) : (
                        <img className={cx('avatar')} src="/photos/default-avatar.png" alt="default-avatar" />
                    )}
                </div>
            </div>
            <div className={cx('post-body')}>
                <div className={cx('post-info')}>
                    <div className={cx('address', 'info')}>
                        <FontAwesomeIcon icon={faLocationDot} className={cx('info-icon')} />
                        <span>
                            {' '}
                            {` ${props.address.houseNumber}, ${props.address.street}, ${props.address.ward.name}, ${props.address.district.name}, ${props.address.province.name}`}
                        </span>
                    </div>
                    <div className={cx('time', 'info')}>
                        <FontAwesomeIcon icon={faClock} className={cx('info-icon')} />
                        <span>Starting time: {new Date(props.startTime).toLocaleString()}</span>
                    </div>
                    <div className={cx('money', 'info')}>
                        <FontAwesomeIcon icon={faMoneyBill1} className={cx('info-icon')} />
                        <span>Money: {props.salaryOrFee}</span>
                    </div>
                    <div className={cx('people-needed', 'info')}>
                        <FontAwesomeIcon icon={faPerson} className={cx('info-icon')} />
                        <span>Need: {props.quantityUserNeeded} people</span>
                    </div>
                    <div className={cx('category', 'info')}>
                        <FontAwesomeIcon icon={faLayerGroup} className={cx('info-icon')} />
                        <span>Category: {props.category}</span>
                    </div>
                    <div className={cx('status', 'info')}>
                        <FontAwesomeIcon icon={faSignalPerfect} className={cx('info-icon')} />
                        <span>Status: {props.status}</span>
                    </div>
                    <Description describe={props.description} />

                    {contact && (
                        <>
                            <div className={cx('phone-number', 'info')}>
                                <FontAwesomeIcon icon={faPhoneVolume} className={cx('info-icon')} />
                                <span>Phone number: {props.creator.phoneNumber}</span>
                            </div>
                            <div className={cx('email', 'info')}>
                                <FontAwesomeIcon icon={faEnvelope} className={cx('info-icon')} />
                                <span>Email: {props.creator.email}</span>
                            </div>
                        </>
                    )}
                    <div className={cx('post-buttons')}>
                        {contact ? (
                            <Button outline large className={cx('contact-button')} onClick={handleContact}>
                                Hide contact
                            </Button>
                        ) : (
                            <Button outline large className={cx('contact-button')} onClick={handleContact}>
                                Show contact
                            </Button>
                        )}
                        {!applied && (
                            <Button primary large className={cx('apply-button')} onClick={handleApply}>
                                APPLY
                            </Button>
                        )}
                        {applied && (
                            <>
                                <Button
                                    primary
                                    large
                                    className={cx('retract-button')}
                                    onClick={() => handleDeleteApply()}
                                >
                                    Cancel application
                                </Button>
                            </>
                        )}
                    </div>
                </div>
                <div className={cx('post-media')}>
                    {props.images && props.images.length > 0 ? (
                        <ImageSlider mediaItems={props.images} />
                    ) : (
                        <img className={cx('no_image')} src="/photos/no_image.jpg" alt="nothing is privided" />
                    )}
                </div>
            </div>
            {selectedCreator && (
                <RevieweeReviewModal
                    userId={selectedCreator}
                    reviewType={'EXECUTOR_TO_CREATOR'}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default Post;
