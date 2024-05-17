import Search from '~/components/Layouts/components/Search';
import Post from '~/components/job/Post';
import React, { useState, useEffect } from 'react';
import requestApi from '~/api/httpRequest';
import Pagination from '~/components/Layouts/components/Pagination'; // Import component Pagination
import classNames from 'classnames/bind';
import styles from './Home.module.scss';

const cx = classNames.bind(styles);

function Home() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function fetchPosts() {
            requestApi(
                `/jobs?order=DESC&take=10&page=${currentPage}&status=Searching&startTime=${new Date().toISOString()}`,
                'GET',
            )
                .then((data) => {
                    setPosts(data.data.data);
                    setTotalPages(data.data.meta.pageCount);
                })
                .catch((error) => console.error('Error fetching provinces:', error));
        }

        fetchPosts();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchResults = (searchResults) => {
        setPosts(searchResults.data);
    };
    return (
        <div>
            <Search onSearch={handleSearchResults} />
            <div className={cx('app')}>
                {posts.length > 0 ? (
                    <>
                        {posts.map((post) => (
                            <Post key={post.id} {...post} />
                        ))}{' '}
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                    </>
                ) : (
                    <>
                        <img className={cx('loading')} src={'/gif/loading.gif'} alt="loading" />
                        <h2> Job not available</h2>
                    </>
                )}
            </div>
        </div>
    );
}

export default Home;
