import { providerWrapper } from 'midway'
import { Column, CreatedAt, DataType, Model, Scopes, Table, UpdatedAt } from 'sequelize-typescript'

const { STRING, INTEGER } = DataType

// using factory style to provide Model because most useful
// sequelize methods are static in Model class. If you use
// @provide style, this class will be initialized when injected.
export const factory = () => DiscussModel
providerWrapper([
    {
        id: 'DiscussModel',
        provider: factory,
    },
])
// you need to export the type of Model class to ensure
// type-safety outside
export type IDiscussModel = typeof DiscussModel

@Scopes({
    // a self-defined scope means "non-soft-deleted rows"
    avaliable: {
        where: { status: 1 },
    },
})
@Table({
    // you can claim your tableName explicitly
    freezeTableName: true,
    tableName: 'discuss',
})
export class DiscussModel extends Model<DiscussModel> {
    @Column({
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    discussId: number

    @Column({
        type: STRING(255),
        comment: '用户id',
    })
    userId: string

    @Column({
        type: INTEGER,
        comment: '帖子id',
    })
    topicId: string

    @Column({
        type: STRING(1000),
        comment: '回复者姓名',
    })
    replyName: string

    @Column({
        type: STRING(1000),
        comment: '回复内容',
    })
    replyContent: string

    @CreatedAt
    @Column({ field: 'created_at' })
    created_at: Date

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updated_at: Date
}
