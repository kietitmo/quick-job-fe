import classNames from 'classnames/bind';
import styles from './AddressItem.module.scss';

const cx = classNames.bind(styles);

function AddressItem({ children }) {
    return <div className={cx('wrapper')}>{children}</div>;
}

export default AddressItem;
