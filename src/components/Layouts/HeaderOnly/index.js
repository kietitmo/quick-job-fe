import classNames from 'classnames/bind';
import styles from './HeaderOnly.module.scss';
import Header from '~/components/Layouts/components/Header';
import Footer from '~/components/Layouts/components/Footer';

const cx = classNames.bind(styles);

function HeaderOnly({ children }) {
    return (
        <div className={cx('wrapper')}>
            <Header />
            <div className={cx('container')}>
                <div className={cx('content')}>{children}</div>
            </div>
            <Footer />
        </div>
    );
}

export default HeaderOnly;
