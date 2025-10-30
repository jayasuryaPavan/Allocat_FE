import { ApiService } from './api'
import type { ApiResponse } from '../types/api'
import type { User } from '../types/user'

export interface CreateUserRequest {
  username: string
  email: string
  password?: string
  firstName: string
  lastName: string
  phone?: string
  roleName?: string
  storeId?: number
}

const api = new ApiService()

export class UsersApiService {
  static async getAllUsers(): Promise<ApiResponse<User[]>> {
    const response = await api.get('/users')
    return response.data
  }
  static async createUser(data: CreateUserRequest): Promise<ApiResponse<User>> {
    const response = await api.post('/users', data)
    return response.data
  }
}


