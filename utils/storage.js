// 单例模式封装storage
export default class Storage {
    constructor(key, isSync = false) {
        this.key = key;
        this.isSync = isSync;

        //一个标记，用来判断是否已将创建了该类的实例
        this.instance = null;
    }

    static getInstance(key, isSync = false) {
        // 已经实例化了，返回第一次实例化对象的引用
        if (this.instance && this.instance.key === key && this.instance.isSync === isSync) {
            return this.instance;
        }

        // 如果该Key没有实例化，则创建一个该类的实例
        this.instance = new Storage(key, isSync);
        return this.instance;
    }

    get() {
        const {
            key,
            isSync
        } = this;

        if (isSync) {
            return wx.getStorageSync(key);
        }

        return new Promise((resolve, reject) => {
            wx.getStorage({
                key,
                success(res) {
                    resolve(res.data);
                },
                fail(error) {
                    reject(error.errMsg);
                }
            })
        })
    }

    set(data) {
        const {
            key,
            isSync
        } = this;

        if (isSync) {
            wx.setStorageSync(key, data);
            return false;
        }

        return new Promise((resolve, reject) => {
            wx.setStorage({
                key,
                data,
                success(res) {
                    resolve(res);
                },
                fail(error) {
                    reject(error.errMsg);
                }
            })
        })
    }

    remove() {
        const {
            key,
            isSync
        } = this;

        switch (true) {
            case isSync && key === '':
                wx.clearStorageSync();
                break;
            case isSync && key !== '':
                wx.removeStorageSync(key);
                break;
            case !isSync && key === '':
                return new Promise((resolve, reject) => {
                    wx.clearStorage({
                        success(res) {
                            resolve(res);
                        },
                        fail(err) {
                            reject(err.errMsg);
                        }
                    })
                })
            case !isSync && key !== '':
                return new Promise((resolve, reject) => {
                    wx.removeStorage({
                        key,
                        success(res) {
                            resolve(res);
                        },
                        fail(err) {
                            reject(err.errMsg);
                        }
                    })
                })
        }
    }
}
