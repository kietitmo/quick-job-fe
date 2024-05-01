import React from 'react';
import classNames from 'classnames/bind';
import styles from './Pagination.module.scss';

const cx = classNames.bind(styles);

function Pagination({ currentPage, totalPages, onPageChange }) {
    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button key={i} onClick={() => onPageChange(i)} className={currentPage === i ? cx('active') : ''}>
                    {i}
                </button>,
            );
        }
        return pages;
    };

    return <div className={cx('pagination')}>{renderPagination()}</div>;
}

export default Pagination;
