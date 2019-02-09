import { Context, controller, get, provide } from 'midway'

/**
 * 根路径
 *
 * @export
 * @class HomeController
 */
@provide()
@controller('/')
export class HomeController {
    @get('/')
    async index(ctx: Context) {
        ctx.body = `Hello you midwayjs !`
    }
}
