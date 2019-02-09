import { inject, provide } from 'midway'
import { Sequelize } from 'sequelize-typescript'

import { IDiscussModel } from '@model/discuss'
import { ITopicModel } from '@model/topic'
import { ITopicLikeModel } from '@model/topic-like'
import { IUserService } from '@service/user/user'

import {
    IinsertDiscussOptions, IinsertTopicOptions, IputTopicLikeOptions, IqueryDiscussOptions,
    IqueryTopicLikeCountsOptions, IqueryTopicLikeOrNotOptions
} from './interface'

const Op = Sequelize.Op

export interface ITopicService extends TopicService {}

/**
 * 帖子相关业务 包括关注 点赞 评论
 *
 * @export
 * @class TopicService
 */
@provide()
export class TopicService {
    @inject()
    private TopicModel: ITopicModel

    @inject()
    private TopicLikeModel: ITopicLikeModel

    @inject()
    private DiscussModel: IDiscussModel

    @inject()
    private userService: IUserService

    /**
     * 搜索查询帖子列表
     *
     * @param {string} search
     * @returns
     * @memberof TopicService
     */
    async queryTopicListBySearch(search: string) {
        return await this.TopicModel.findAll({
            where: { topicTitle: { [Op.regexp]: search } },
            order: [['created_at', 'DESC']],
        })
    }

    /**
     * followId 列表查询帖子列表
     *
     * @param {string[]} followList
     * @returns
     * @memberof TopicService
     */
    async queryTopicListByUserId(followList: string[]) {
        return await this.TopicModel.findAll({
            where: { userId: { [Op.in]: followList } },
            order: [['created_at', 'DESC']],
        })
    }

    /**
     * 新增帖子
     *
     * @param {IinsertTopicOptions} options
     * @returns
     * @memberof TopicService
     */
    async insertTopic(options: IinsertTopicOptions) {
        return await this.TopicModel.create(options)
    }

    /**
     * 新增评论
     *
     * @param {IinsertDiscussOptions} options
     * @returns
     * @memberof TopicService
     */
    async insertDiscuss(options: IinsertDiscussOptions) {
        return await this.DiscussModel.create(options)
    }

    /**
     * 查询帖子详情
     *
     * @param {number} topicId
     * @returns
     * @memberof TopicService
     */
    async queryTopicDetail(topicId: number) {
        return await this.TopicModel.findOne({ where: { topicId } })
    }

    /**
     * 创建或更新点赞状态
     *
     * @param {IputTopicLikeOptions} options
     * @returns
     * @memberof TopicService
     */
    async putTopicLike(options: IputTopicLikeOptions) {
        const result = await this.queryTopicLikeOrNot(options)

        if (!result) {
            return await this.TopicLikeModel.create(options)
        } else {
            return await this.TopicLikeModel.update(options, {
                where: {
                    topicId: options.topicId,
                    userId: options.userId,
                },
            })
        }
    }

    /**
     * 查询评论详情
     *
     * @param {IqueryDiscussOptions} options
     * @returns
     * @memberof TopicService
     */
    async queryDiscuss(options: IqueryDiscussOptions) {
        return await this.DiscussModel.findAll({
            where: options,
        })
    }

    /**
     * 查询帖子数量
     *
     * @param {string} userId
     * @returns
     * @memberof TopicService
     */
    async queryTopicCounts(userId: string) {
        return await this.TopicModel.findAndCountAll({ where: { userId }, order: [['created_at', 'DESC']] })
    }

    /**
     * 查询帖子点赞数量
     *
     * @param {IqueryTopicLikeCountsOptions} options
     * @returns
     * @memberof TopicService
     */
    async queryTopicLikeCounts(options: IqueryTopicLikeCountsOptions) {
        return await this.TopicLikeModel.findAndCountAll({ where: options })
    }

    /**
     * 查找是否点过赞
     *
     * @param {IqueryTopicLikeOrNotOptions} options
     * @returns
     * @memberof TopicService
     */
    async queryTopicLikeOrNot(options: IqueryTopicLikeOrNotOptions) {
        return await this.TopicLikeModel.findOne({ where: options })
    }

    /**
     * 帖子详情handler
     *
     * @param {number} topicId
     * @param {string} userId
     * @returns
     * @memberof TopicService
     */
    async topicDetailHandler(topicId: number, userId: string) {
        return Promise.all([
            // 查询帖子详情
            this.queryTopicDetail(topicId),
            // 查询帖子评论
            this.queryDiscuss({ topicId }),
            // 查询用户是否已点赞
            this.queryTopicLikeOrNot({
                topicId, // 帖子id
                userId,
                status: 1,
            }),
            this.queryTopicLikeCounts({
                topicId, // 帖子id
                // userId: ctx.user.userId,
                status: 1,
            }),
        ]).then(async ([topic, discuss, topicLike, topicLikeCounts]) => {
            const user = await this.userService.getUserByUserId(topic.userId)
            // 处理帖子数据
            const disscussList = discuss.map(item => ({
                replyName: item.replyName,
                replyContent: item.replyContent,
                userId: item.userId,
            }))
            // 返回帖子详情
            return {
                userInfo: {
                    username: user.username,
                    avatarUrl: user.avatarUrl,
                    userId: user.userId,
                },
                topic: {
                    topicTitle: topic.topicTitle,
                    topicImgList: JSON.parse(topic.topicImg),
                    created_at: topic.created_at,
                    topicId,
                    topicLike: !!topicLike,
                    topicLikeCounts: topicLikeCounts.count,
                },
                discuss: disscussList,
            }
        })
    }
}
