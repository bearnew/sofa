// const baseUrl = 'http://www.sddsqt.com';
const baseUrl = 'http://127.0.0.1:1225';
import Storage from './storage';

const http = ({ url = '', param = {}, ...other } = {}) => {
    wx.showLoading({
        title: '请求中，请耐心等待..'
    });
    let timeStart = Date.now();
    const tokenStore = Storage.getInstance('token', true);
    console.log(tokenStore.get())

    return new Promise((resolve, reject) => {
        wx.request({
            url: getUrl(url),
            data: param,
            header: {
                'content-type': 'application/json', // 默认值 ,另一种是 "content-type": "application/x-www-form-urlencoded"
                'Authorization': `Bearer ${tokenStore.get()}`
            },
            ...other,
            complete: res => {
                wx.hideLoading();
                // console.log(`耗时${Date.now() - timeStart}`);
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data)
                } else {
                    reject(res)
                }
            }
        })
    })
}

const getUrl = (url) => {
    if (url.indexOf('://') == -1) {
        url = baseUrl + url;
    }
    return url
}

// get方法
const get = (url, param = {}) => {
    return http({
        url,
        param
    })
}

const post = (url, param = {}) => {
    return http({
        url,
        param,
        method: 'post'
    })
}

const put = (url, param = {}) => {
    return http({
        url,
        param,
        method: 'put'
    })
}

// const delete = (url, param = {}) => {
//     return http({
//         url,
//         param,
//         method: 'put'
//     })
// }

export default {
    get,
    post,
    put,
    // delete
}
