export interface IUser {
  id?: string
  name: string
  email: string
  password?: string
  role: string
}

export interface ICourse {
  id?: string
  title: string
  duration: number
  questions?: IQuestion[]
  professor?: string
  active?: boolean
  description: string
  createdAt?: Date
  updatedAt?: Date
  fkProfessor?: string
}

export interface ICourseCreation {
  title: string
  duration: number
  description: string
}

export interface IQuestion {
  id?: string
  createdAt?: Date
  question: string
  answers?: []
  fkStudent: string
  fkCourse: string
}

export interface IQuestionAnswer {
  id?: string
  createdAt?: Date
  answer: string
  fkQuestion: string
  fkProfessor: string
  fkCourse: string
}

export interface IWallet {
  id?: string
  total: number
  updatedAt?: Date
  fkUser: string
}

export interface IPendingPayments {
  id?: string
  createdAt?: Date
  value: number
  reason: string
  fkProfessor: string
}

export interface IFinishedPayments {
  id?: string
  createdAt?: Date
  value: number
  reason: string
  fkProfessor: string
}

export interface HttpError {
  status: number
  message: string
}

export interface JwtParse {
  data: {
    id: string
    name: string
    role: string
  }

  expiresIn: string
  iat: number
}
