// 新增评论参数
export interface IqueryTopicOptions {
    topicId: string // 帖子id
    replyContent: string // 帖子内容
    replyName: string // 用户名
    userId: string // 用户id
}

export interface IputTopicLikeOptions {
    topicId: string | number // 帖子id
    userId: string // 用户id
    status: number
}

export interface IqueryTopicLikeOrNotOptions {
    topicId: string | number // 帖子id
    userId: string // 用户id
}

// 查询帖子详情
export interface IqueryDiscussOptions {
    topicId: string | number // 帖子id
    userId?: string // 用户id
}
