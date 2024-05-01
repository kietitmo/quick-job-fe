import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import Button from '~/components/Button';
import { useState, useEffect } from 'react';
import requestApi from '~/api/httpRequest';

// import PrettoSlider from './PrettoSlider';
import { Slider } from '@mui/material';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';

const cx = classNames.bind(styles);

function Search({ onSearch }) {
    // address
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedWard, setSelectedWard] = useState('');
    useEffect(() => {
        // Fetch danh sách các tỉnh/thành phố từ API khi component được tạo
        fetchProvinces();
    }, []);

    const fetchProvinces = async () => {
        try {
            const response = await requestApi('/address/provinces', 'GET');
            setProvinces(response.data);
        } catch (error) {
            console.error('Error fetching provinces:', error);
        }
    };

    const fetchDistricts = async (provinceCode) => {
        try {
            const response = await requestApi(`/address/districts/${provinceCode}`, 'GET');
            setDistricts(response.data);
        } catch (error) {
            console.error('Error fetching districts:', error);
        }
    };

    const fetchWards = async (districtCode) => {
        try {
            const response = await requestApi(`/address/wards/${districtCode}`, 'GET');
            setWards(response.data);
        } catch (error) {
            console.error('Error fetching wards:', error);
        }
    };

    const handleProvinceChange = async (event) => {
        const provinceCode = event.target.value;
        setSelectedProvince(provinceCode);
        await fetchDistricts(provinceCode);
    };

    const handleDistrictChange = async (event) => {
        const districtCode = event.target.value;
        setSelectedDistrict(districtCode);
        await fetchWards(districtCode);
    };

    const handleWardChange = async (event) => {
        const wardCode = event.target.value;
        setSelectedWard(wardCode);
    };

    // money range
    const [moneyRange, setMoneyRange] = useState([0, 1000]);
    const minDistance = 5;
    const handleChanges = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setMoneyRange([Math.min(newValue[0], moneyRange[1] - minDistance), moneyRange[1]]);
        } else {
            setMoneyRange([moneyRange[0], Math.max(newValue[1], moneyRange[0] + minDistance)]);
        }
    };
    const handleChangeMin = (e) => {
        const minValue = e.target.value;
        if (minValue < moneyRange[1]) {
            setMoneyRange([+minValue, moneyRange[1]]);
        }
    };
    const handleChangeMax = (e) => {
        const maxValue = e.target.value;
        if (maxValue > moneyRange[0]) {
            setMoneyRange([moneyRange[0], +maxValue]);
        }
    };

    // time
    const [date, setDate] = useState(new Date());

    const handleChangDate = (date) => {
        setDate(date._d);
    };
    // search
    const [searchValue, setSearchValue] = useState('');

    const handleChange = (e) => {
        const searchValue = e.target.value;
        if (!searchValue.startsWith(' ')) {
            setSearchValue(searchValue);
        }
    };

    const onSubmit = async () => {
        // Logic tìm kiếm...
        const response = await requestApi(
            `/jobs?order=DESC&minSalary=${moneyRange[0]}&startTime=${date.toISOString()}&maxSalary=${
                moneyRange[1]
            }&title=${searchValue}&province_code=${selectedProvince}&district_code=${selectedDistrict}&ward_code=${selectedWard}&status=Searching`,
            'GET',
        );
        if (onSearch) {
            onSearch(response.data);
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('search-bar')}>
                <span className={cx('search-title')}>Enter what you want to find:</span>
                <input
                    value={searchValue}
                    spellCheck={false}
                    onChange={handleChange}
                    className={cx('input-content')}
                    placeholder="what do you want to find?"
                />
                <Button className={cx('find-job-button')} primary onClick={onSubmit}>
                    Find jobs
                </Button>
            </div>
            <div className={cx('search-address')}>
                <span className={cx('search-title')}>Address:</span>

                <select
                    value={selectedProvince}
                    label="Province"
                    className={cx('address')}
                    onChange={handleProvinceChange}
                >
                    <option value="">Select Province</option>
                    {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                            {province.name}
                        </option>
                    ))}
                </select>

                <select
                    value={selectedDistrict}
                    label="District"
                    className={cx('address')}
                    onChange={handleDistrictChange}
                >
                    <option value="">Select District</option>
                    {districts &&
                        districts.map((district) => (
                            <option key={district.code} value={district.code}>
                                {district.name}
                            </option>
                        ))}
                </select>

                <select value={selectedWard} label="Ward" className={cx('address')} onChange={handleWardChange}>
                    <option value="">Select Ward</option>
                    {wards &&
                        wards.map((ward) => (
                            <option key={ward.code} value={ward.code}>
                                {ward.name}
                            </option>
                        ))}
                </select>
            </div>
            <div className={cx('search-time-salary')}>
                <div className={cx('time-wrapper')}>
                    <p className={cx('time-title')}>Starting time:</p>
                    <div className={cx('time-choose')}>
                        <Datetime
                            className={cx('datepicker')}
                            viewMode="time"
                            dateFormat="DD-MM-YYYY"
                            closeOnSelect={true}
                            initialViewDate={new Date()}
                            value={date}
                            onChange={handleChangDate}
                        />
                    </div>
                </div>
                <div className={cx('price-wrapper')}>
                    <span className={cx('price-title')}>Fee:</span>
                    <Slider
                        className={cx('price-slider')}
                        value={moneyRange}
                        onChange={handleChanges}
                        valueLabelDisplay="off"
                        step={5}
                        min={0}
                        max={1000}
                    />
                    <div className={cx('min-max-display')}>
                        <div className={cx('min-display')}>
                            <h2 className={cx('min-label')}>Min:</h2>
                            <input className={cx('min-value')} value={moneyRange[0]} onChange={handleChangeMin} />
                        </div>
                        <div className={cx('max-display')}>
                            <h2 className={cx('max-label')}>Max </h2>
                            <input className={cx('max-value')} value={moneyRange[1]} onChange={handleChangeMax} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
