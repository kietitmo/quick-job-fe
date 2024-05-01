import classNames from 'classnames/bind';
import styles from './Forbidden.module.scss';

const cx = classNames.bind(styles);

const Forbidden = () => {
    return (
        <div className={cx('forbidden')}>
            <>
                <div className={cx('maincontainer')}>
                    <div className={cx('bat')}>
                        <img
                            className={cx('wing leftwing')}
                            src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-wing.png"
                            alt=""
                        />
                        <img
                            className={cx('body')}
                            src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-body.png"
                            alt="bat"
                        />
                        <img
                            className={cx('wing rightwing')}
                            src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-wing.png"
                            alt=""
                        />
                    </div>
                    <div className={cx('bat')}>
                        <img
                            className={cx('wing leftwing')}
                            src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-wing.png"
                            alt=""
                        />
                        <img
                            className={cx('body')}
                            src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-body.png"
                            alt="bat"
                        />
                        <img
                            className={cx('wing rightwing')}
                            src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-wing.png"
                            alt=""
                        />
                    </div>
                    <div className={cx('bat')}>
                        <img
                            className={cx('wing leftwing')}
                            src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-wing.png"
                            alt=""
                        />
                        <img
                            className={cx('body')}
                            src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-body.png"
                            alt="bat"
                        />
                        <img
                            className={cx('wing rightwing')}
                            src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/bat-wing.png"
                            alt=""
                        />
                    </div>
                    <img
                        className={cx('foregroundimg')}
                        src="https://aimieclouse.com/Media/Portfolio/Error403Forbidden/HauntedHouseForeground.png"
                        alt="haunted house"
                    />
                </div>
                <h1 className={cx('errorcode')}>ERROR 403</h1>
                <div className={cx('errortext')}>This area is forbidden. Turn back now!</div>
            </>
        </div>
    );
};

export default Forbidden;
