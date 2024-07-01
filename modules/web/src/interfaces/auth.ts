export interface IUser {
  id: string,
  firstname: string,
  lastname?: string,
  email: string,
  verified?: boolean
  verificationBadge: boolean
}

export interface IAuth {
  loggedUser: IUser | null
}

export interface IResetPassword {
  token: string
  userId: string
  newPassword: string
}

export interface IOtp {
  otp: string
}

