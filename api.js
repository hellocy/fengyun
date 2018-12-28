let path = '/';

module.exports = {

    // goods
    goodsList: path + 'goods/list',
    goodsDetail: path + 'goods/detail',
    goodsDelete: path + 'goods/delete',
    goodsAdd: path + 'goods/add',
    goodsDeleteMulti: path + 'goods/delete-multi',
    goodsUploadImg: path + 'goods/upload-img',

    // user
    userList: path + 'user/list',
    getManagers: path + 'user/getManagers',
    updateManager: path + 'user/updateManager',
    userDtl: path + 'user/userDtl',
    getBalance: path + 'user/getBalance',
    getMoney: path + 'user/getMoney',
    winRecord: path + 'user/winRecord',
    winRanking: path + 'user/winRanking',
    userDelete: path + 'user/delete',
    userAdd: path + 'user/add',
    userReg: path + 'user/reg',
    userUpdate: path + 'user/update',
    addManager: path + 'user/addManager',
    userDeleteMulti: path + 'user/delete-multi',
    userLogin: path + 'user/login',
    userLogout: path + 'user/logout',
    updatePwd: path + 'user/updatePwd',
    sendMail: path + 'user/sendMail',
    userAutoLogin: path + 'user/auto-login',
    userChangeRole: path + 'user/change-role',
    searchUser: path + 'user/searchUser',

    chargeHistory: path + 'order/history', // 获取充点历史
    chargeList: path + 'order/list', // 获取充点请求列表
    chargeReq: path + 'order/request', // 充点请求
    chargeAdd: path + 'order/add', // 充点
    getMoneyHistory: path + 'order/getMonyHistory', // 提点
    getMoneyAllHistory: path + 'order/getMoneyAllHistory', // 提点


    //authority
    fetchAll: path + 'authority/fetchAll',
    getAuthorityByUser: path + 'authority/getAuthorityByUser',


    //动物
    animalList: path + 'animal/list', //获取所有动物
    add: path + 'animal/add', //添加动物


    //地点
    placeAdd: path + 'place/add', //添加地点
    placeList: path + 'place/list', //获取所有地点
    getPlaceDtl: path + 'place/detail', //获取地点详情
    editPlace: path + 'place/update', //获取地点详情
    placeSubjectImage: path + 'place/subjectImage', //地点题目图片上传
    placeSubject: path + 'place/update', //获取地点详情
    saveSubject: path + 'place/saveSubject', //获取地点题目
    getSubject: path + 'place/getSubject', //获取地点题目
    placeDel: path + 'place/delete', //删除地点

    //场次
    getTodySession: path + 'session/getTodySession', //获取当日场次
    getHistory: path + 'session/getHistory', //获取所有场次
    getOpenSession: path + 'session/getOpenSession', //获取所有已开奖场次
    setSettion1: path + 'session/setSettion1', //开奖时间和倍率
    setSettion2: path + 'session/setSettion2', //开奖动物
    setSettion3: path + 'session/setSettion3', //本场最高可购买点数
    setSettion4: path + 'session/setSettion4', //禁止买入的动物
    getSessionInfo: path + 'session/getSessionInfo', //获取开奖时间
    openSession: path + 'session/openSession', //获取开奖时间
    getPlaceSessionHistory: path + 'session/getPlaceSessionHistory', //获取开奖时间

    //买点（下注）
    buyList: path + 'buy/list', //获取所有下注列表
    buyAdd: path + 'buy/addOne', //新增一条购买记录
    getBuyDtl: path + 'buy/getBuyDtl', //获取用户购买详情
    updateBuy: path + 'buy/updateBuy', //更新用户购买详情
    getSessionBuyList: path + 'buy/getSessionBuyList', //获取用户购买列表
    getSessionBuyAnimal: path + 'buy/getSessionBuyAnimal', //获取用户购买详情

    getAnimalBuyTotal: path + 'buy/getAnimalBuyTotal', //更新用户购买详情

    //公告
    addNotice: path + 'notice/addNotice', //添加公告
    getNotice: path + 'notice/getNotice', //获取最近的公告
    setNotice: path + 'notice/setNotice', //修改公告

    //消息
    getMessage: path + 'message/getMessage', //获取消息
    updateMessage: path + 'message/updateMessage', //更新消息状态

    //下载
    app: path + 'getapp',
    getipa: path + 'getipa',
    
    getOsInfo: path + 'getOsInfo'

};