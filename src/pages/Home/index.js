import Search from '~/components/Layouts/components/Search';
import Post from '~/components/Post';
import React, { useState, useEffect } from 'react';
import requestApi from '~/api/httpRequest';
import Pagination from '~/components/Layouts/components/Pagination'; // Import component Pagination

function Home() {
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // Thêm state để lưu trang hiện tại
    const [totalPages, setTotalPages] = useState(1); // Thêm state để lưu tổng số trang

    useEffect(() => {
        async function fetchPosts() {
            requestApi(
                `/jobs?order=DESC&take=10&page=${currentPage}&status=Searching&startTime=${new Date().toISOString()}`,
                'GET',
            ) // Sử dụng currentPage để lấy trang hiện tại
                .then((data) => {
                    setPosts(data.data.data);
                    setTotalPages(data.data.meta.pageCount); // Lưu tổng số trang từ dữ liệu trả về
                })
                .catch((error) => console.error('Error fetching provinces:', error));
        }

        fetchPosts();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page); // Cập nhật trang hiện tại khi người dùng chọn trang mới
    };

    const handleSearchResults = (searchResults) => {
        setPosts(searchResults.data);
        // Cập nhật tổng số trang tương ứng với kết quả tìm kiếm (nếu cần)
        // setTotalPages(searchResults.meta.pageCount); // Ví dụ: Đặt totalPages là 1 nếu kết quả tìm kiếm chỉ ở trang đầu tiên
    };
    return (
        <div>
            <Search onSearch={handleSearchResults} />
            <div className="app">
                {posts.map((post) => (
                    <Post key={post.id} {...post} />
                ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
    );
}

export default Home;
