import classNames from 'classnames/bind';
import styles from './DefaultLayout.module.scss';

import Header from '~/components/Layouts/components/Header';
import Footer from '~/components/Layouts/components/Footer';
// import Sidebar from '~/components/Layouts/components/SideBar';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
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

export default DefaultLayout;
