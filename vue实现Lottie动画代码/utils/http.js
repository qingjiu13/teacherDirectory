// @/utils/http.js
import { UPLOAD_FILE_URL } from '@/store/user/API.js';

export const http = (options) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: baseURL + options.url,
            method: options.method || 'GET',
            data: options.data || {},
            header: options.header || {
                'Content-Type': 'application/json'
            },
            success: (res) => {
                if (res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    reject(res.data);
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};

export const uploadFile = (filePath, userId, fileType = 'file') => {
    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: UPLOAD_FILE_URL,
            filePath,
            name: fileType,
            formData: {
                userId: userId
            },
            success: (res) => {
                const data = JSON.parse(res.data);
                if (data.code === 200) {
                    resolve(data);
                } else {
                    reject(data);
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};
