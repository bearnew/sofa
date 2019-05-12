Component({
    data: {

    },
    methods: {
        // 分享
        share: function () {
            this.triggerEvent('clickShare');
        },
        // 点赞
        praise: function () {
            this.triggerEvent('clickPraise');
        },
    }
})