import axios from 'axios';

function requestApi(endpoint, method, body, responseType = 'json') {
    const headers = {
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
    };
    const instance = axios.create({ headers, baseURL: process.env.REACT_APP_BASE_SERVER_URL });

    instance.interceptors.request.use(
        (config) => {
            const auth = JSON.parse(localStorage.getItem('auth'));
            if (auth) {
                config.headers['Authorization'] = `Bearer ${auth.tokens.accessToken}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        },
    );

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalConfig = error.config;
            console.log(error.response);
            if (error.response && error.response.status === 419) {
                try {
                    console.log('call refresh token api');
                    const auth = JSON.parse(localStorage.getItem('auth'));
                    const token = auth.tokens;
                    const result = await instance.post(`/auth/refresh`, {
                        refreshToken: token.refreshToken,
                    });
                    const { accessToken, refreshToken } = result.data;
                    auth.tokens.accessToken = accessToken;
                    auth.tokens.refreshToken = refreshToken;
                    localStorage.setItem('auth', JSON.stringify({ ...auth }));

                    originalConfig.headers['Authorization'] = `Bearer ${accessToken}`;

                    return instance(originalConfig);
                } catch (err) {
                    if (
                        err.response &&
                        err.response.status === 500 &&
                        err.response.data.message === 'jwt expired' &&
                        err.response.data.path === '/auth/refresh'
                    ) {
                        console.log('2', err.response);
                        window.location.href = '/login';
                        localStorage.removeItem('auth');
                    }
                    return Promise.reject(err);
                }
            }

            return Promise.reject(error);
        },
    );

    if (body instanceof FormData) {
        // Kiểm tra nếu body là FormData (có file)
        return instance.request({
            method: method,
            url: `${endpoint}`,
            data: body,
            responseType: responseType,
        });
    } else {
        // Nếu không có file, sử dụng dữ liệu truyền vào trực tiếp
        return instance.request({
            method: method,
            url: `${endpoint}`,
            data: body,
            responseType: responseType,
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
        });
    }
}

export default requestApi;
