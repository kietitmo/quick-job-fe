import classNames from 'classnames/bind';
import styles from './Footer.module.scss';
import { Link } from 'react-router-dom';
import routesConfig from '~/config/routes';

const cx = classNames.bind(styles);

function Footer() {
    return (
        <div className={cx('footer')}>
            <Link to={routesConfig.home} className={cx('footer-logo')}>
                <span>Quick-JOB</span>
            </Link>
            <p className={cx('footer-info')}>The graduation project of Kiet Nguyen from ITMO University</p>
        </div>
    );
}

export default Footer;
