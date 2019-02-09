import { Context, controller, get, inject, provide } from 'midway'

import { urlNamespace } from '@config/data'
import { IQiniuService } from '@service/qiniu/qiniu'

/**
 * 七牛接口
 *
 * @export
 * @class HandleController
 */
@provide()
@controller(urlNamespace + '/handle')
export class HandleController {
    @inject()
    qiniuService: IQiniuService

    @get('/upload/get-token')
    async getQiniuToken(ctx: Context) {
        const token = await this.qiniuService.getQiniuToken()
        if (token) {
            ctx.returnBody(200, '获取token成功', { token, baseUrl: 'http://pmfr4g4i0.bkt.clouddn.com' })
        } else {
            ctx.throw(400, '请配置七牛鉴权参数')
        }
    }
}
