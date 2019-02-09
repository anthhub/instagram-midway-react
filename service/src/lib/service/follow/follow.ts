import { inject, provide } from 'midway'

import { IFollowModel } from '@model/follow'

import { IfollowUserOptions } from './interface'

export interface IFollowService extends FollowService {}

@provide()
export class FollowService {
    @inject()
    private FollowModel: IFollowModel

    /**
     * 关注用户
     *
     * @param {IfollowUserOptions} options
     * @returns
     * @memberof FollowService
     */
    async followUser(options: IfollowUserOptions) {
        const obj = await this.FollowModel.findOne({ where: { userId: options.userId } })
        if (obj) {
            // update
            return await obj.update(options)
        } else {
            // insert
            return await this.FollowModel.create(options)
        }
    }

    /**
     * 查询关注用户的列表
     *
     * @param {string} followedId
     * @param {number} [status]
     * @returns
     * @memberof FollowService
     */
    async findFollowList(followedId: string, status?: number) {
        return await this.FollowModel.findAll({ where: { followedId, status } })
    }

    /**
     * 查询用户关注的数量
     *
     * @param {IfollowUserOptions} options
     * @returns
     * @memberof FollowService
     */
    async findFollowCounts(options: IfollowUserOptions) {
        return await this.FollowModel.findAndCountAll({ where: options })
    }
}
