import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import styles from './Post.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

const Description = ({ describe }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
    };

    return (
        <div className={cx('descripe', 'info')}>
            <FontAwesomeIcon icon={faInfoCircle} className={cx('info-icon')} />
            <span>
                Description: {showFullDescription ? describe : `${describe.slice(0, 100)}`}
                {!showFullDescription && describe.length > 100 && (
                    <button onClick={toggleDescription} className={cx('show-more')}>
                        Show more
                    </button>
                )}
            </span>
        </div>
    );
};

export default Description;
