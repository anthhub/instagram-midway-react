import { config, Context, controller, get, inject, post, provide } from 'midway'

import { urlNamespace } from '@config/data'
import { IUserService } from '@service/user/user'

/**
 * 管理登录状态
 *
 * @export
 * @class LoginController
 */
@provide()
@controller(urlNamespace + '/login')
export class LoginController {
    @inject()
    userService: IUserService

    @config('auth_cookie_name')
    auth_cookie_name

    /**
     * 注册
     *
     * @param {Context} ctx
     * @memberof LoginController
     */
    @post('/register')
    async register(ctx: Context) {
        const { mobile, password, code, username, email } = ctx.request.body

        // 错误处理
        const message = this.__errNotice({ mobile, password, code, username, email })
        if (message) {
            ctx.throw(400, message)
            return
        }

        // 注册成功返回体
        ctx.body = await this.userService.register({ password, username, email })
    }

    /**
     * 登录
     *
     * @param {Context} ctx
     * @memberof LoginController
     */
    @post('/')
    async login(ctx: Context) {
        const { password, email } = ctx.request.body

        // 登录
        const token = await this.userService.login({ password, email })

        // set cookie
        if (token) {
            // id存入Cookie, 用于验证过期.
            const opts = {
                path: '/',
                maxAge: 1000 * 60 * 60 * 24 * 30,
                // maxAge: 1000 * 40,
                // signed: true,
                httpOnly: false,
                domain: '127.0.0.1',
            }
            ctx.cookies.set(this.auth_cookie_name, token, opts) // cookie 有效期30天
            ctx.returnBody(200, '登录成功')
        } else {
            ctx.throw(400, '用户名或密码错误')
        }
    }

    /**
     * 登出
     *
     * @param {Context} ctx
     * @memberof LoginController
     */
    @get('/signout')
    async signout(ctx: Context) {
        ctx.cookies.set(this.auth_cookie_name, '')
        ctx.returnBody(200, '退出登录成功')
    }

    /**
     * 参数异常函数
     *
     * @private
     * @param {*} { mobile, password, code, username, email }
     * @returns
     * @memberof LoginController
     */
    private __errNotice({ mobile, password, code, username, email }) {
        // 参数校验
        let message = ''
        if (!mobile && !email) {
            message = '手机号或者邮箱不能为空'
        } else if (!username) {
            message = '用户名为空'
        } else if (!password) {
            message = '密码不能为空'
        }

        return message
    }
}
