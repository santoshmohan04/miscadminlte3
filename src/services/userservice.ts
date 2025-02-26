// src/services/UserService.ts

import axios from "axios";
import { User } from "./usertypes"; // Adjust the import based on your project structure
import { ApiResponse } from "./sharedtypes";

const apiBaseUri = "http://localhost:5173";

const endpoint_user_get = "/users";
const endpoint_user_add = "/users/add";
const endpoint_user_edit = "/users/edit";
const endpoint_user_delete = "/users/delete";

export class UserService {
  async getUser(userId: number): Promise<ApiResponse<User>> {
    const uri = `${apiBaseUri}${endpoint_user_get}/${userId}`;
    const response = await axios.get<ApiResponse<User>>(uri);
    return response.data;
  }

  async getUsersList(
    searchKey?: string,
    sortKey?: string
  ): Promise<ApiResponse<User[]>> {
    const params: { [key: string]: string } = {};

    if (searchKey) {
      params.searchKey = searchKey;
    }

    if (sortKey) {
      params.sortKey = sortKey;
    }

    const uri = `${apiBaseUri}${endpoint_user_get}`;
    const response = await axios.get<ApiResponse<User[]>>(uri, { params });
    return response.data;
  }

  async addUser(newUser: User): Promise<ApiResponse<User>> {
    const uri = `${apiBaseUri}${endpoint_user_add}`;
    const response = await axios.post<ApiResponse<User>>(uri, newUser);
    return response.data;
  }

  async editUser(updateUser: User): Promise<ApiResponse<User>> {
    const uri = `${apiBaseUri}${endpoint_user_edit}/${updateUser.User_ID}`;
    const response = await axios.post<ApiResponse<User>>(uri, updateUser);
    return response.data;
  }

  async deleteUser(userId: number): Promise<ApiResponse<User>> {
    const uri = `${apiBaseUri}${endpoint_user_delete}/${userId}`;
    const response = await axios.get<ApiResponse<User>>(uri);
    return response.data;
  }
}
