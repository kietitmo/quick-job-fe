import classNames from 'classnames/bind';
import styles from './NoHeader.module.scss';

const cx = classNames.bind(styles);

function NoHeader({ children }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default NoHeader;
