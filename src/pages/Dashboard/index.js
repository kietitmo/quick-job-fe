import JobPosted from '~/components/JobPosted';
import ApplicationJob from '~/components/ApplicationJob';
import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';
import ReceivedJob from '~/components/ReceivedJob';

const cx = classNames.bind(styles);

function Dashboard() {
    return (
        <div className={cx('dashboard-container')}>
            <h1 className={cx('element')}>DASHBOARD</h1>
            <JobPosted />
            <br />
            <ApplicationJob />
            <br />
            <ReceivedJob />
        </div>
    );
}

export default Dashboard;
