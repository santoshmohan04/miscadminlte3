// src/services/TaskService.ts

import axios from "axios";
import { Task } from "./tasktypes"; // Adjust the import based on your project structure
import { ApiResponse } from "./sharedtypes";

const apiBaseUri = "http://localhost:4300";

const endpoint_task_get = "/tasks";
const endpoint_task_add = "/tasks/add";
const endpoint_task_edit = "/tasks/edit";
const endpoint_task_delete = "/tasks/delete";

export class TaskService {
  async getTask(taskId: number): Promise<ApiResponse<Task>> {
    const uri = `${apiBaseUri}${endpoint_task_get}/${taskId}`;
    const response = await axios.get<ApiResponse<Task>>(uri);
    return response.data;
  }

  async getTasksList(projectId?: number, sortKey?: string): Promise<ApiResponse<Task[]>> {
    const params: { [key: string]: string } = {};

    if (projectId) {
      params.projectId = projectId.toString();
    }

    if (sortKey) {
      params.sortKey = sortKey;
    }

    const uri = `${apiBaseUri}${endpoint_task_get}`;
    const response = await axios.get<ApiResponse<Task[]>>(uri, { params });
    return response.data;
  }

  async addTask(newTask: Task): Promise<ApiResponse<Task>> {
    const uri = `${apiBaseUri}${endpoint_task_add}`;
    const response = await axios.post<ApiResponse<Task>>(uri, newTask);
    return response.data;
  }

  async editTask(updateTask: Task): Promise<ApiResponse<Task>> {
    const uri = `${apiBaseUri}${endpoint_task_edit}`;
    const response = await axios.post<ApiResponse<Task>>(uri, updateTask);
    return response.data;
  }

  async endTask(taskId: number): Promise<ApiResponse<Task>> {
    const uri = `${apiBaseUri}${endpoint_task_delete}/${taskId}`;
    const response = await axios.get<ApiResponse<Task>>(uri);
    return response.data;
  }
}
