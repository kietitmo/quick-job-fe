import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './EditJobModal.module.scss';
import requestApi from '~/api/httpRequest';

const cx = classNames.bind(styles);

const EditJobModal = ({ job, onClose }) => {
    const auth = JSON.parse(localStorage.getItem('auth'));
    const [formData, setFormData] = useState({
        title: job.title,
        description: job.description,
        startTime: job.startTime,
        endTime: job.endTime,
        quantityUserNeeded: job.quantityUserNeeded,
        salaryOrFee: job.salaryOrFee,
        category: job.category,
        address: {
            province_code: job.address.province.code,
            district_code: job.address.district.code,
            ward_code: job.address.ward.code,
            street: job.address.street,
            houseNumber: job.address.houseNumber,
        },
    });
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [categories, setCategories] = useState([]);
    const [file, setFile] = useState([]); // Thêm state cho file

    useEffect(() => {
        // Fetch danh sách các tỉnh/thành phố từ API
        requestApi('/address/provinces', 'GET')
            .then((data) => setProvinces(data.data))
            .catch((error) => console.error('Error fetching provinces:', error));
        requestApi('/jobs/category', 'GET')
            .then((data) => setCategories(data.data))
            .catch((error) => console.error('Error fetching categories:', error));
        setFormData({
            title: job.title,
            description: job.description,
            startTime: new Date(job.startTime),
            endTime: new Date(job.endTime),
            quantityUserNeeded: job.quantityUserNeeded,
            salaryOrFee: job.salaryOrFee,
            category: job.category,
            address: {
                province_code: job.address.province.code,
                district_code: job.address.district.code,
                ward_code: job.address.ward.code,
                street: job.address.street,
                houseNumber: job.address.houseNumber,
            },
        });
    }, [
        job.address.district.code,
        job.address.houseNumber,
        job.address.province.code,
        job.address.street,
        job.address.ward.code,
        job.category,
        job.description,
        job.endTime,
        job.quantityUserNeeded,
        job.salaryOrFee,
        job.startTime,
        job.title,
    ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            address: {
                ...prevState.address,
                [name]: value,
            },
        }));
    };

    const handleProvinceChange = async (e) => {
        const provinceCode = e.target.value;
        setFormData((prevState) => ({
            ...prevState,
            address: {
                ...prevState.address,
                province_code: provinceCode,
            },
        }));
        try {
            const data = await requestApi(`/address/districts/${provinceCode}`, 'GET');
            setDistricts(data.data);
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    const handleDistrictChange = async (e) => {
        const districtCode = e.target.value;
        setFormData((prevState) => ({
            ...prevState,
            address: {
                ...prevState.address,
                district_code: districtCode,
            },
        }));
        try {
            const data = await requestApi(`/address/wards/${districtCode}`, 'GET');
            setWards(data.data);
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFile(files);
    };

    const clearSelectedFiles = () => {
        setFile([]); // Xóa mảng các file đã chọn
        const input = document.getElementById('media');
        if (input) {
            input.value = ''; // Xóa giá trị của input file để reset nó
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Kiểm tra start time không được bắt đầu trong quá khứ
        const currentTime = new Date().toISOString();
        if (formData.startTime < currentTime) {
            alert('Start time cannot be in the past');
            return;
        }

        // Kiểm tra end time phải sau start time
        if (formData.endTime <= formData.startTime) {
            alert('End time must be after start time');
            return;
        }

        try {
            const formDataWithFile = new FormData();
            formDataWithFile.append('creatorId', auth.userId);
            formDataWithFile.append('title', formData.title);
            formDataWithFile.append('description', formData.description);
            formDataWithFile.append('startTime', formData.startTime);
            formDataWithFile.append('endTime', formData.endTime);
            formDataWithFile.append('quantityUserNeeded', formData.quantityUserNeeded);
            formDataWithFile.append('salaryOrFee', formData.salaryOrFee);
            formDataWithFile.append('address[province_code]', formData.address.province_code);
            formDataWithFile.append('address[district_code]', formData.address.district_code);
            formDataWithFile.append('address[ward_code]', formData.address.ward_code);
            formDataWithFile.append('address[street]', formData.address.street);
            formDataWithFile.append('address[houseNumber]', formData.address.houseNumber);
            formDataWithFile.append('category', formData.category);
            if (file) {
                file.forEach((file) => {
                    formDataWithFile.append('files', file);
                });
            }

            const response = await requestApi(`/jobs/${job.id}`, 'PATCH', formDataWithFile);
            console.log(response.data); // Xử lý response nếu cần
            // Reset form sau khi submit thành công
            window.alert('Updated job!');
            setFormData({
                creatorId: '',
                title: '',
                description: '',
                startTime: '',
                endTime: '',
                quantityUserNeeded: '',
                salaryOrFee: '',
                category: '',
                address: {
                    province_code: '',
                    district_code: '',
                    ward_code: '',
                    street: '',
                    houseNumber: '',
                },
            });
            clearSelectedFiles();
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className={cx('edit-job-modal')}>
            {
                <form className={cx('edit-job-form')} onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="category">Category:</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">{formData.category}</option>
                            {Object.entries(categories).map(([key, value]) => (
                                <option key={key} value={key}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="startTime">Start Time:</label>
                        <input
                            type="datetime-local"
                            id="startTime"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="endTime">End Time:</label>
                        <input
                            type="datetime-local"
                            id="endTime"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="quantityUserNeeded">Quantity User Needed:</label>
                        <input
                            type="number"
                            id="quantityUserNeeded"
                            name="quantityUserNeeded"
                            value={formData.quantityUserNeeded}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="salaryOrFee">Salary or Fee:</label>
                        <input
                            type="text"
                            id="salaryOrFee"
                            name="salaryOrFee"
                            value={formData.salaryOrFee}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="province_code">Province:</label>
                        <select
                            id="province_code"
                            name="province_code"
                            value={formData.address.province_code}
                            onChange={handleProvinceChange}
                            required
                        >
                            <option value="">Select Province</option>
                            {provinces.map((province) => (
                                <option key={province.code} value={province.code}>
                                    {province.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="district_code">District:</label>
                        <select
                            id="district_code"
                            name="district_code"
                            value={formData.address.district_code}
                            onChange={handleDistrictChange}
                            required
                        >
                            <option value="">Select District</option>
                            {districts.map((district) => (
                                <option key={district.code} value={district.code}>
                                    {district.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="ward_code">Ward:</label>
                        <select
                            id="ward_code"
                            name="ward_code"
                            value={formData.address.ward_code}
                            onChange={handleAddressChange}
                            required
                        >
                            <option value="">Select Ward</option>
                            {wards.map((ward) => (
                                <option key={ward.code} value={ward.code}>
                                    {ward.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="street">Street:</label>
                        <input
                            type="text"
                            id="street"
                            name="street"
                            value={formData.address.street}
                            onChange={handleAddressChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="houseNumber">House Number:</label>
                        <input
                            type="text"
                            id="houseNumber"
                            name="houseNumber"
                            value={formData.address.houseNumber}
                            onChange={handleAddressChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="media">Media:</label>
                        <input type="file" id="media" name="media" onChange={handleFileChange} multiple />
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                        <button className={cx('close-button')} onClick={() => onClose()}>
                            Close
                        </button>
                    </div>
                </form>
            }
        </div>
    );
};

export default EditJobModal;
