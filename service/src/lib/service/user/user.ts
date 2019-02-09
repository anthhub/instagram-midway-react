import { config, inject, provide } from 'midway'

import { IUserModel } from '@model/user'

import { ILoginOptions, IRegisterOptions, IupdateUserInfoOptions } from './interface'

const jwt = require('jsonwebtoken')
const uuidv1 = require('uuid/v4')

export interface IUserService extends UserService {}

/**
 * 用户相关服务
 *
 * @export
 * @class UserService
 */
@provide()
export class UserService {
    @inject()
    private UserModel: IUserModel

    @config('jwtSecret')
    private jwtSecret

    /**
     * 获取用户信息
     *
     * @param {string} userId
     * @returns
     * @memberof UserService
     */
    async getUserByUserId(userId: string) {
        return this.UserModel.findOne({ where: { userId } })
    }

    /**
     * 用户注册
     *
     * @param {IRegisterOptions} options
     * @returns
     * @memberof UserService
     */
    async register(options: IRegisterOptions) {
        // 添加uuid
        options.userId = uuidv1().replace(/-/g, '')

        // 是否可以查询到
        const queryResult = await this.hasRegister(options.email)

        if (queryResult) {
            return { status: 200, message: '邮箱已被使用', data: { flag: false } }
        }

        const userInfo = await this.UserModel.create(options)

        // 注册成功，返回userid给前端
        return { status: 200, message: '注册成功', data: { userId: userInfo.dataValues.userId, flag: true } }
    }

    /**
     * 登录
     *
     * @param {ILoginOptions} options
     * @returns
     * @memberof UserService
     */
    async login(options: ILoginOptions) {
        const existUser = await this.getUserByMail(options.email)

        // 用户不存在
        if (!existUser) {
            return null
        }

        const passhash = existUser.password
        let token = ''
        // TODO: change to async compare
        const equal = passhash === options.password

        // 密码匹配
        if (equal) {
            token = jwt.sign({ userId: existUser.userId }, this.jwtSecret || 'token', { expiresIn: '7d' })
        }
        // 验证通过
        return token
    }

    /**
     * 更新用户信息
     *
     * @param {IupdateUserInfoOptions} options
     * @returns
     * @memberof UserService
     */
    async updateUserInfo(options: IupdateUserInfoOptions) {
        return this.UserModel.update(options, { where: { userId: options.userId } })
    }

    /**
     * 通过邮箱获取用户
     *
     * @param {string} email
     * @returns
     * @memberof UserService
     */
    async getUserByMail(email: string) {
        return this.UserModel.findOne({ where: { email } })
    }

    /**
     * 邮箱校验账号是否存在
     *
     * @private
     * @param {string} email
     * @returns
     * @memberof UserService
     */
    private async hasRegister(email: string) {
        // 查询用户名
        const userInfo = await this.getUserByMail(email)

        if (userInfo && userInfo.dataValues.userId) {
            return true
        }
        return false
    }
}
