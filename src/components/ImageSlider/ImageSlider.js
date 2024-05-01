import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretLeft, faSquareCaretRight } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';
import styles from './ImageSlider.module.scss';

const cx = classNames.bind(styles);
function ImageSlider({ mediaItems }) {
    const [activeImageNum, setCurrent] = useState(0);
    const length = mediaItems.length;
    const nextSlide = () => {
        setCurrent(activeImageNum === length - 1 ? 0 : activeImageNum + 1);
    };
    const prevSlide = () => {
        setCurrent(activeImageNum === 0 ? length - 1 : activeImageNum - 1);
    };
    if (!Array.isArray(mediaItems) || mediaItems.length <= 0) {
        return null;
    }
    return (
        <div>
            <section className={cx('image-slider')}>
                <div className={cx('left')}>
                    <FontAwesomeIcon icon={faSquareCaretLeft} onClick={prevSlide} />
                </div>

                {mediaItems.map((currentSlide, ind) => {
                    return (
                        <div className={ind === activeImageNum ? 'currentSlide active' : 'currentSlide'} key={ind}>
                            {ind === activeImageNum && (
                                <img
                                    src={process.env.REACT_APP_BASE_SERVER_URL + currentSlide.url}
                                    alt={currentSlide}
                                    className={cx('image')}
                                />
                            )}
                        </div>
                    );
                })}

                <div className={cx('right')}>
                    <FontAwesomeIcon icon={faSquareCaretRight} onClick={nextSlide} />
                </div>
            </section>
        </div>
    );
}
export default ImageSlider;
