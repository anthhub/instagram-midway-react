import { providerWrapper } from 'midway'
import { Column, CreatedAt, DataType, Model, Scopes, Table, UpdatedAt } from 'sequelize-typescript'

const { STRING, INTEGER } = DataType

// using factory style to provide Model because most useful
// sequelize methods are static in Model class. If you use
// @provide style, this class will be initialized when injected.
export const factory = () => TopicLikeModel
providerWrapper([
    {
        id: 'TopicLikeModel',
        provider: factory,
    },
])
// you need to export the type of Model class to ensure
// type-safety outside
export type ITopicLikeModel = typeof TopicLikeModel

@Scopes({
    // a self-defined scope means "non-soft-deleted rows"
    avaliable: {
        where: { status: 1 },
    },
})
@Table({
    // you can claim your tableName explicitly
    freezeTableName: true,
    tableName: 'topic_like',
})
export class TopicLikeModel extends Model<TopicLikeModel> {
    @Column({
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number

    @Column({
        type: INTEGER,
        comment: '帖子id',
    })
    topicId: number

    @Column({
        type: STRING(255),
        comment: '用户id',
    })
    userId: string

    @Column({
        type: INTEGER(1),
        comment: '帖子状态1: 点赞 0: 取消点赞',
    })
    status: number

    @CreatedAt
    @Column({ field: 'created_at' })
    created_at: Date

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updated_at: Date
}
