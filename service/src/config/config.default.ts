module.exports = (appInfo: any) => {
    const config: any = (exports = {})

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1539671912752_2826'

    // add your config here
    config.middleware = []

    config.sequelize = {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'touwohaozhesi',
        database: 'learn',
        dialect: 'mysql',
    }

    // close csrf for unit test
    config.security = { csrf: false }

    // token凭证
    config.jwtSecret = 'shawzhou'

    // authorization's white list
    config.authWhiteList = ['/api/v2/login', '/api/v2/login/register']

    // cookie name config
    config.auth_cookie_name = 'token'

    return config
}
