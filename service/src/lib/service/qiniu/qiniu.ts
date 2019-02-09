import { provide } from 'midway'
import * as qiniu from 'qiniu'

export interface IQiniuService extends QiniuService {}

/**
 * 七牛token业务
 *
 * @export
 * @class QiniuService
 */
@provide()
export class QiniuService {
    private accessKey: string = '' // 秘钥
    private secretKey: string = '' // 秘钥
    private publicBucketDomain = '' // 外链默认域名

    private options = { scope: 'instagram', expires: 7200 }

    /**
     * 获取七牛上传token
     *
     * @returns
     * @memberof QiniuService
     */
    async getQiniuToken() {
        if (!this.accessKey || !this.secretKey || !this.publicBucketDomain) {
            return null
        }
        const mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey)
        const putPolicy = new qiniu.rs.PutPolicy(this.options)
        const uploadToken = putPolicy.uploadToken(mac)

        return uploadToken
    }
}
