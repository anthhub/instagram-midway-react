import { providerWrapper } from 'midway'
import { Column, CreatedAt, DataType, Model, Scopes, Table, UpdatedAt } from 'sequelize-typescript'

const { STRING, INTEGER } = DataType

// using factory style to provide Model because most useful
// sequelize methods are static in Model class. If you use
// @provide style, this class will be initialized when injected.
export const factory = () => FollowModel
providerWrapper([
    {
        id: 'FollowModel',
        provider: factory,
    },
])
// you need to export the type of Model class to ensure
// type-safety outside
export type IFollowModel = typeof FollowModel

@Scopes({
    // a self-defined scope means "non-soft-deleted rows"
    avaliable: {
        where: { status: 1 },
    },
})
@Table({
    // you can claim your tableName explicitly
    freezeTableName: true,
    tableName: 'follow',
})
export class FollowModel extends Model<FollowModel> {
    @Column({
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id: number

    @Column({
        type: STRING(255),
        comment: '用户id',
    })
    userId: string

    @Column({
        type: STRING(255),
        comment: '关注者id',
    })
    followedId: string

    @Column({
        type: INTEGER(1),
        allowNull: false,
        comment: '关注状态 0:取消关 1:已关注',
    })
    status: string

    @CreatedAt
    @Column({ field: 'created_at' })
    created_at: Date

    @UpdatedAt
    @Column({ field: 'updated_at' })
    updated_at: Date
}
