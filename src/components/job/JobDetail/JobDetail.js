import styles from './JobDetail.module.scss';
import classNames from 'classnames/bind';
import React from 'react';
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
import ImageSlider from '~/components/general/ImageSlider';
import Description from './Description';

const cx = classNames.bind(styles);
const JobDetail = ({ props, onClose }) => {
    return (
        <div className={cx('modalBackground')}>
            <div className={cx('post')}>
                <div className={cx('post-header')}>
                    <div className={cx('post-title')}>{props.title}</div>
                    <button className={cx('close-button')} onClick={onClose}>
                        Close
                    </button>
                </div>
                <div className={cx('post-body')}>
                    <div className={cx('post-info')}>
                        <div className={cx('address', 'info')}>
                            <FontAwesomeIcon icon={faLocationDot} className={cx('info-icon')} />
                            <span>
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

                        <div className={cx('phone-number', 'info')}>
                            <FontAwesomeIcon icon={faPhoneVolume} className={cx('info-icon')} />
                            <span>Phone number: {props.creator.phoneNumber}</span>
                        </div>
                        <div className={cx('email', 'info')}>
                            <FontAwesomeIcon icon={faEnvelope} className={cx('info-icon')} />
                            <span>Email: {props.creator.email}</span>
                        </div>
                    </div>
                    <div className={cx('post-media')}>
                        {props.media && props.media.length > 0 ? (
                            <ImageSlider mediaItems={props.media.filter((x) => x.mediaType === 'IMAGE')} />
                        ) : (
                            <img className={cx('no_image')} src="/photos/no_image.jpg" alt="nothing is privided" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
