// Dashboard.jsx
import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Dashboard.module.scss';
import JobPosted from '~/components/JobPosted';
import ApplicationJob from '~/components/ApplicationJob';
import ReceivedJob from '~/components/ReceivedJob';

const cx = classNames.bind(styles);

function Dashboard() {
    const [activeComponent, setActiveComponent] = useState(null);
    const [homeDash, setHomeDash] = useState(true);

    const handleSetActiveComponent = (component) => {
        setActiveComponent(component);
        setHomeDash(false);
    };

    return (
        <div className={cx('dashboard-container')}>
            <h1 className={cx('element')}>DASHBOARD</h1>
            <div className={cx('buttons-container')}>
                <button
                    className={cx('buttons', { active: activeComponent === 'JobPosted' })}
                    onClick={() => handleSetActiveComponent('JobPosted')}
                >
                    Job Posted
                </button>
                <button
                    className={cx('buttons', { active: activeComponent === 'ApplicationJob' })}
                    onClick={() => handleSetActiveComponent('ApplicationJob')}
                >
                    Application Job
                </button>
                <button
                    className={cx('buttons', { active: activeComponent === 'ReceivedJob' })}
                    onClick={() => handleSetActiveComponent('ReceivedJob')}
                >
                    Received Job
                </button>
            </div>
            <div className={cx('component-container')}>
                {activeComponent === 'JobPosted' && <JobPosted />}
                {activeComponent === 'ApplicationJob' && <ApplicationJob />}
                {activeComponent === 'ReceivedJob' && <ReceivedJob />}
                {homeDash && (
                    <div>
                        {' '}
                        This is your <b>Dashboard</b>. Please choose above button!
                    </div>
                )}
            </div>
            {homeDash && (
                <div>
                    <img className={cx('component-container-gif')} src={'/gif/meomeo.webp'} alt="Avatar" />
                </div>
            )}
        </div>
    );
}

export default Dashboard;
