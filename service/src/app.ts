import { DB } from './lib/model/db'

// build db connections when starting APP
module.exports = app => {
    app.beforeStart(async () => {
        console.log('====================================')
        console.log('🚀  Your awesome APP is launching...')
        console.log('====================================')

        await DB.initDB(app.config.sequelize)

        console.log('====================================')
        console.log('✅  Your awesome APP launched')
        console.log('====================================')
    })
}
