export interface User {
    userId?: number,
    username? : string,
    password?: string,
    email?: string,
    name?: string,
    tel?:string,
    birth?:string,
    address?: string
    roles?: any,
    check? :boolean
}

export interface UserLoginInput{
    username: string,
    password: string
}
export interface LoginUser{ 
    username:string, password:string, email:string, name:string,
    tel:string, birth:string, userId? : number,
    token: any, roles: any    
}

export interface UserInfo{
    username:string, password:string, email:string, name:string,
    tel:string, birth:string, userId? : number,
    token: any, roles: any   
}

export interface UserInfoState{
    data: UserInfo[]
    isloggined: boolean
}

export interface UserState{
    data: User[]
    status: 'idle' | 'loading' | 'failed'
    token?: null,
    isLoggined: boolean,
    error : null;
    loginedUser: null,
    check: boolean
}

/** 
export interface ImageInput{
    item : string
    color: string
}
*/
/**
export interface Image {
    picture : any
}
 */
export interface InputImage{
    name: string
    lastModified: number
    lastModifiedDate: number
    type: string
    webkitRelativePath: string    
    size : number
}


export interface ImageState{
    data: InputImage
    status: 'successed' | 'loading' | 'failed'
}

export interface UploadFileResponse {
    success: boolean,
    message: string
}
export interface GetFileResponse {
    success: boolean,
    message: string
}

export interface ValidatorResponse {
    isValid: boolean,
    errorMessage: string
}

export const fileTypes = [
    'jpg',
    'png',
    'mp3',
    'mp4',
    'gif'

]