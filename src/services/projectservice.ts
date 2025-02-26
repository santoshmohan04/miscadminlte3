// src/services/ProjectService.ts

import axios from "axios";
import { Project } from "./projecttypes"; // Adjust the import based on your project structure
import { ApiResponse } from "./sharedtypes";

const apiBaseUri = "http://localhost:4300";

const endpoint_project_get = "/projects";
const endpoint_project_add = "/projects/add";
const endpoint_project_edit = "/projects/edit";
const endpoint_project_delete = "/projects/delete";

export class ProjectService {
  async getProjects(searchKey?: string, sortKey?: string): Promise<ApiResponse<Project[]>> {
    const params: { [key: string]: string } = {};

    if (searchKey) {
      params.searchKey = searchKey;
    }

    if (sortKey) {
      params.sortKey = sortKey;
    }

    const uri = `${apiBaseUri}${endpoint_project_get}`;
    const response = await axios.get<ApiResponse<Project[]>>(uri, { params });
    return response.data;
  }

  async getProject(projectId: number): Promise<ApiResponse<Project>> {
    const uri = `${apiBaseUri}${endpoint_project_get}/${projectId}`;
    const response = await axios.get<ApiResponse<Project>>(uri);
    return response.data;
  }

  async addProject(newProject: Project): Promise<ApiResponse<Project>> {
    const uri = `${apiBaseUri}${endpoint_project_add}`;
    const response = await axios.post<ApiResponse<Project>>(uri, newProject);
    return response.data;
  }

  async editProject(updateProject: Project): Promise<ApiResponse<Project>> {
    const uri = `${apiBaseUri}${endpoint_project_edit}/${updateProject.Project_ID}`;
    const response = await axios.post<ApiResponse<Project>>(uri, updateProject);
    return response.data;
  }

  async deleteProject(projectId: number): Promise<ApiResponse<Project>> {
    const uri = `${apiBaseUri}${endpoint_project_delete}/${projectId}`;
    const response = await axios.get<ApiResponse<Project>>(uri);
    return response.data;
  }
}