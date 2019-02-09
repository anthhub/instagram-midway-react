import { config, Context, controller, get, inject, post, provide } from 'midway'

import { urlNamespace } from '@config/data'
import { IFollowService } from '@service/follow/follow'
import { ITopicService } from '@service/topic/topic'
import { IUserService } from '@service/user/user'

/**
 * 管理用户信息
 *
 * @export
 * @class UserController
 */
@provide()
@controller(urlNamespace + '/user')
export class UserController {
    @inject()
    userService: IUserService

    @inject()
    followService: IFollowService

    @inject()
    topicService: ITopicService

    @config('auth_cookie_name')
    auth_cookie_name

    /**
     * 获取用户信息
     *
     * @param {Context} ctx
     * @memberof UserController
     */
    @get('/info')
    async userInfo(ctx: Context) {
        // 获取并填充数据
        const { username, email, avatarUrl, abstract, mobile, sex, userId } = await this.userService.getUserByUserId(
            ctx.query.userId || ctx.user.userId
        )

        const userInfo = { username, email, avatarUrl, abstract, account: email.replace(/@.*/, ''), mobile, sex, userId }
        ctx.returnBody(200, '获取成功', userInfo)
    }

    /**
     * 更新用户信息
     *
     * @param {Context} ctx
     * @memberof UserController
     */
    @post('/update')
    async updateUserInfo(ctx: Context) {
        const { userId } = ctx.user
        const contentBody = ctx.request.body

        // 更新已使用的他人邮箱地址
        if (contentBody.email) {
            const resultEmail = await this.userService.getUserByMail(contentBody.email)
            if (resultEmail && resultEmail.userId !== userId) {
                ctx.returnBody(400, '该邮箱已被其他账户使用')
                return
            }
        }

        // 密码校验不通过
        const result = await this.userService.getUserByUserId(userId)
        if (contentBody.password && result && result.password !== contentBody.password) {
            ctx.returnBody(400, '原密码不正确')
            return
        } else if (contentBody.password) {
            contentBody.password = contentBody.newPassword
        }

        // 获取并填充数据
        await this.userService.updateUserInfo(contentBody)

        // 已更改密码，让用户重新登录
        if (contentBody.password) {
            ctx.cookies.set(this.auth_cookie_name, '')
            ctx.returnBody(401, '密码更新成功，请重新登录')
        } else {
            ctx.returnBody(200, '更新成功')
        }
    }

    /**
     * 获取用户关注、粉丝、帖子数量
     *
     * @param {Context} ctx
     * @memberof UserController
     */
    @get('/personal')
    async userPersonalInfo(ctx: Context) {
        const userId = ctx.query.userId || ctx.user.userId

        // 用户帖子
        const topics = await this.topicService.queryTopicCounts(userId)

        const topicList = []
        // 将所有帖子处理完毕
        for (const topic of topics.rows) {
            const item = await this.topicService.topicDetailHandler(topic.topicId, userId)
            topicList.push(item)
        }

        // 用户粉丝
        const fansCounts = await this.followService.findFollowCounts({ userId, status: 1 })

        // 用户关注数
        const followCounts = await this.followService.findFollowCounts({ followedId: userId, status: 1 })

        // 非本人查询是否关注了登录人
        const isSelf = !ctx.query.userId || ctx.query.userId === ctx.user.userId

        // 查询已关注用户
        let followNum = 0
        if (!isSelf) {
            const followList = await this.followService.findFollowCounts({
                followedId: ctx.user.userId,
                userId: ctx.query.userId,
                status: 1,
            })
            followNum = followList.count
        }

        ctx.returnBody(200, '获取成功', {
            topic: { counts: topics.count, topicList },
            followCounts: followCounts.count,
            fansCounts: fansCounts.count,
            isSelf,
            hasFollow: followNum > 0,
        })
    }
}
