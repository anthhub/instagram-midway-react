import { Context, controller, get, inject, post, provide, put } from 'midway'

import { urlNamespace } from '@config/data'
import { IFollowService } from '@service/follow/follow'
import { ITopicService } from '@service/topic/topic'
import { IUserService } from '@service/user/user'

/**
 * 管理帖子
 *
 * @export
 * @class TopicController
 */
@provide()
@controller(urlNamespace + '/topic')
export class TopicController {
    @inject()
    topicService: ITopicService

    @inject()
    userService: IUserService

    @inject()
    followService: IFollowService

    /**
     * 新增帖子
     *
     * @param {Context} ctx
     * @memberof TopicController
     */
    @post('/add')
    async addTopic(ctx: Context) {
        const { topicImg, topicTitle } = ctx.request.body

        await this.topicService.insertTopic({
            topicImg: JSON.stringify(topicImg),
            topicTitle,
            userId: ctx.user.userId,
        })

        ctx.returnBody(200, '发帖成功')
    }

    /**
     * 新增评论
     *
     * @param {Context} ctx
     * @memberof TopicController
     */
    @post('/discuss/add')
    async addDiscuss(ctx: Context) {
        const { topicId, replyContent } = ctx.request.body

        const userId = ctx.user.userId
        // 获取并填充数据
        const { username } = await this.userService.getUserByUserId(userId)

        const discuss = await this.topicService.insertDiscuss({
            topicId,
            replyContent,
            replyName: username,
            userId,
        })

        if (discuss) {
            ctx.returnBody(200, '评论成功')
        } else {
            ctx.returnBody(400, '网络异常请稍后重试')
        }
    }

    // 获取帖子详情
    /**
     * 获取帖子详情
     *
     * @param {Context} ctx
     * @memberof TopicController
     */
    @get('/detail')
    async topicDetail(ctx: Context) {
        const { topicId } = ctx.request.query

        const topicDetail = await this.topicService.queryTopicDetail(+topicId)

        ctx.returnBody(200, '成功', topicDetail)
    }

    /**
     * 给帖子点赞
     *
     * @param {Context} ctx
     * @memberof TopicController
     */
    @put('/like')
    async putLikeTopic(ctx: Context) {
        const { topicId, status } = ctx.request.body

        const userId = ctx.user.userId

        // 未曾创建进行创建操作，否则进行更新
        await this.topicService.putTopicLike({ topicId, userId, status })

        ctx.returnBody(200, '更新成功', { status: +status })
    }

    // 获取用户发布帖子数量
    async queryTopic(ctx: Context) {
        // 查询点赞数量
        return await this.topicService.queryTopicCounts(ctx.user.userId)
    }

    /**
     * 获取帖子列表
     *
     * @param {Context} ctx
     * @memberof TopicController
     */
    @get('/friend/list')
    async friendsTopicList(ctx: Context) {
        const userId = ctx.user.userId

        // 查询帖子详情
        const follower = await this.followService.findFollowList(userId, 1)

        // 处理需要查询用户帖子的userId
        const followList = follower.map(item => item.userId)
        followList.push(userId)

        // 获取每个帖子详情、评论，发帖人信息
        const topics = await this.topicService.queryTopicListByUserId(followList)
        const topicList = []

        // 将所有帖子处理完毕
        for (const topic of topics) {
            const item = await this.topicService.topicDetailHandler(topic.topicId, userId)
            topicList.push(item)
        }

        ctx.returnBody(200, '成功', topicList)
    }

    /**
     * 搜索帖子
     *
     * @param {Context} ctx
     * @memberof TopicController
     */
    @get('/search')
    async searchTopic(ctx: Context) {
        const { search } = ctx.request.query
        const topics = await this.topicService.queryTopicListBySearch(search)
        const topicList = []

        // 将所有帖子处理完毕
        for (const topic of topics) {
            const item = await this.topicService.topicDetailHandler(topic.topicId, ctx.user.userId)
            topicList.push(item)
        }

        ctx.returnBody(200, '成功', topicList)
    }
}
