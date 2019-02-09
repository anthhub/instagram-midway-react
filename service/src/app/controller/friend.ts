import { Context, controller, get, inject, post, provide } from 'midway'

import { urlNamespace } from '@config/data'
import { IFollowService } from '@service/follow/follow'

/**
 * 关注业务
 *
 * @export
 * @class FriendController
 */
@provide()
@controller(urlNamespace + '/friend')
export class FriendController {
    @inject()
    followService: IFollowService

    /**
     * 关注好友
     *
     * @param {Context} ctx
     * @memberof FriendController
     */
    @post('/follow')
    async follow(ctx: Context) {
        const { userId, status } = ctx.request.body

        const followedId = ctx.user.userId

        await this.followService.followUser({
            userId, // 被关注者id
            followedId, // 关注者id
            status,
        })

        ctx.returnBody(200, +status ? '关注成功' : '取消成功')
    }

    /**
     * 获取未关注用户列表
     *
     * @param {Context} ctx
     * @memberof FriendController
     */
    @get('/list')
    async notFollowList(ctx: Context) {
        const friendList = await this.followService.findFollowList(ctx.user.userId)

        ctx.returnBody(200, '获取成功', friendList)
    }
}
