// /store/user/unloadFile/unload.js
import { uploadFile } from '@/utils/http';

const state = {
    fileLink: '' // 后端返回的文件下载链接
};

const mutations = {
    SET_FILE_LINK(state, link) {
        state.fileLink = link;
    }
};

const actions = {
    async uploadUserFile({ commit }, { userId, filePath }) {
        try {
            const res = await uploadFile(filePath, userId);
            commit('SET_FILE_LINK', res.data.url); // 后端返回的是 { code: 200, data: { url: 'https://...' } }
            return res;
        } catch (err) {
            console.error('上传失败', err);
            throw err;
        }
    }
};

export default {
    namespaced: true,
    state,
    mutations,
    actions
};
