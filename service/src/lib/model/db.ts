import { provide, scope, ScopeEnum } from 'midway'
import { Sequelize } from 'sequelize-typescript'

import { DiscussModel } from './discuss'
import { FollowModel } from './follow'
import { TopicModel } from './topic'
import { TopicLikeModel } from './topic-like'
import { UserModel } from './user'

interface ISequelizeConfig {
    host: string
    port: number
    user: string
    password: string
    database: string
    dialect: string
}

// providing DB.sequelize in case of hyper features
// of sequelize like "sequelize.transaction"
@scope(ScopeEnum.Singleton)
@provide('DB')
export class DB {
    static sequelize: Sequelize

    static async initDB(config: ISequelizeConfig) {
        DB.sequelize = new Sequelize({
            database: config.database,
            username: config.user,
            password: config.password,
            dialect: config.dialect,
            host: config.host,
            port: config.port,
            timezone: '+08:00',
            logging: false,
            operatorsAliases: false,
        })

        // add models here before using them
        DB.sequelize.addModels([UserModel, TopicModel, DiscussModel, TopicLikeModel, FollowModel])

        try {
            await DB.sequelize.authenticate()
        } catch (error) {
            error.message = `DB connection error: ${error.message}`
            throw error
        }
    }
}
