import { providerWrapper } from 'midway'
import { Column, CreatedAt, DataType, Model, Scopes, Table, UpdatedAt } from 'sequelize-typescript'

const { STRING, INTEGER } = DataType

// using factory style to provide Model because most useful
// sequelize methods are static in Model class. If you use
// @provide style, this class will be initialized when injected.
export const factory = () => TopicModel
providerWrapper([
    {
        id: 'TopicModel',
        provider: factory,
    },
])
// you need to export the type of Model class to ensure
// type-safety outside
export type ITopicModel = typeof TopicModel

@Scopes({
    // a self-defined scope means "non-soft-deleted rows"
    avaliable: {
        where: { status: 1 },
    },
})
@Table({
    // you can claim your tableName explicitly
    freezeTableName: true,
    tableName: 'topic',
})
export class TopicModel extends Model<TopicModel> {
    @Column({
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    topicId: number

    @Column({
        type: STRING(255),
        comment: '用户id',
    })
    userId: string

    @Column({
        type: STRING(255),
        comment: '帖子标题',
    })
    topicTitle: string

    @Column({
        type: STRING(1000),
        allowNull: false,
        comment: '图片地址，',
    })
    topicImg: string

    @Column({
        type: STRING(255),
        defaultValue: '',
        comment: '发表地址',
    })
    address: string

    @CreatedAt
    @Column({ field: 'created_at' })
    created_at: Date

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updated_at: Date
}
