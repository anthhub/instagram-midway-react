## 说明

此项目并非原创, 源码来自于 zhoushaw , 感谢 zhoushaw 的开源 ;), 原项目链接: https://github.com/zhoushaw/Instagram.git

前段时间了解到阿里的 Midway 框架 (基于 eggjs 的 Ioc 框架), 感受一下 Midway 的优雅, 重写了项目后台部分

后台基本写完了, 后面希望能用 react, Typescript 以及 react hooks 再重构一下前台部分,敬请期待

> 如果对您有帮助，您可以点右上角 "Star" 支持一下 谢谢！ ^_^

## 简介

> 打造属于你自己的 instagram!

> 技术栈

- react 全家桶
- ant design
- midway.js
- mysql

 前后端分离开发模式，前端项目与后端项目属于不同的工程

```javascript
// instagram-midway-react/client 前端工程
// instagram-midway-react/service 后端工程
```

注：此项目与 instagram 无任何关系。

## 部分功能截图

> 登录

<img src="https://s10.mogucdn.com/mlcdn/c45406/181201_4bge1k2c4l22ec994hjb496digb2f_419x264.gif" width="665" height="369"/>

> 关注

<img src="https://s10.mogucdn.com/mlcdn/c45406/181201_874ecg16jfkb8elck42lkg753jhgk_600x377.gif" width="665" height="369">

> 发帖

<img src="https://s10.mogucdn.com/mlcdn/c45406/181201_8g2fe66115ijhi5i33iik23i2e2ff_419x264.gif" width="665" height="369">

<!-- <img src="https://s10.mogucdn.com/mlcdn/c45406/181201_52hiflj1l28a6692j8abak6k6i76j_419x264.gif" width="665" height="369">


<img src="https://s10.mogucdn.com/mlcdn/c45406/181201_1kkcaebb013e47b6h4bl16g9i73lh_419x264.gif" width="665" height="369"> -->

> 点赞、评论、搜索

<img src="https://s10.mogucdn.com/mlcdn/c45406/181201_4l95k967h41c2b1hf5jej417fel2e_419x264.gif" width="665" height="369">

> 修改个人信息

<img src="https://s10.mogucdn.com/mlcdn/c45406/181201_6ghc2k2807ih876b0dlibk7a2i463_600x377.gif" width="665" height="369">

## 运行项目

因前后端不同端口原因，为解决跨域。前端  工程启动了 devServer，需先启动后端工程

- git clone https://github.com/zhoushaw/Instagram.git
- cd instagram-midway-react

> 运行后端项目

- 请确保本地已装 mysql，并配置全局变量
- mysql -u root -p 并输入数据库密码
- create database learn; 创建 learn 数据库
- use learn; 切换数据库
- source learn.sql 的路径; 例如：source /Users/shawzhou/Desktop/learning/instagram/db/learn.sql;
- 配置 egg.js 连接数据库信息

```javascript
// 前往service/src/config/config.default.ts，配置你的数据库信息
config.sequelize = {
  dialect: "mysql",
  host: "127.0.0.1",
  port: 3306,
  database: "learn",
  username: "",
  password: "",
  operatorsAliases: false
};
```

- 配置七牛云上传鉴权信息

```javascript

// 前往/service/src/lib/service/qiniu/qiniu.ts，配置你的七牛云获取token信息
export class QiniuService {
    // 前往七牛云的个人面板=>秘钥管理查看
    private accessKey: string = ''; // 秘钥
    private secretKey: string = ''; // 秘钥
    private publicBucketDomain = ''; // 外链默认域名

    private options: qiniuOptioin = {
        scope: '', // 上传空间
        expires: 7200
    }

    // ....
}

// 七牛云存储空间区设置，前往/client/src/components/upload/index.js，配置上传区
class Upload extends React.Component{


    uploadFn = async () => {
        // ...
        var config = {
            region: qiniu.region.z0 // 所属区，可前往七牛云文档查看
        };
        // ...
}
```

>  运行后端项目

- 在/service 文件下

- npm install
- npm start

- 在/client 文件下

- npm install
- npm start

## 目标功能

- [x] 登录、注册 -- 完成
- [x] 修改个人信息 --完成
- [x] 关注 -- 完成
- [x] 评论 -- 完成
- [x] 点赞 -- 完成
- [x] 搜索帖子 -- 完成
- [x] 上传头像 -- 完成
- [x] 发帖 -- 完成
- [x] 收藏 -- 未完成

> 再次感谢原作者 zhoushaw 和 Midway 团队! ^_^
