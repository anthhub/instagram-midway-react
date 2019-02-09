// 新增评论参数
export interface IinsertDiscussOptions {
    topicId: string // 帖子id
    replyContent: string // 帖子内容
    replyName: string // 用户名
    userId: string // 用户id
}

// 新增帖子参数
export interface IinsertTopicOptions {
    topicImg: string // 图片地址
    topicTitle: string // 帖子标题
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
    status?: number
}

// 查询帖子详情
export interface IqueryDiscussOptions {
    topicId: string | number // 帖子id
    userId?: string // 用户id
}

export interface IqueryTopicLikeCountsOptions {
    topicId: string | number // 帖子id
    userId?: string // 用户id
    status?: number
}
