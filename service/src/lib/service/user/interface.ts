export interface IRegisterOptions {
    username: string
    password: string
    mobile?: number
    email: string
    userId?: string
}

export interface ILoginOptions {
    email: string
    password: string
}

export interface IupdateUserInfoOptions {
    userId: string
    email?: string
    password?: string
}
