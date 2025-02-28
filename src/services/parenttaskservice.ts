import axios from "axios";
import { ApiResponse } from "./sharedtypes";
import { ParentTask } from "./tasktypes";

const apiBaseUri = "http://localhost:4300";

const endpoint_parentTask_get = "/parenttasks";
const endpoint_parentTask_add = "/parenttasks/add";

export class ParentTaskService {
  async getParentTask(parentId: number): Promise<ApiResponse<ParentTask>> {
    const uri = `${apiBaseUri}${endpoint_parentTask_get}/${parentId}`;
    const response = await axios.get<ApiResponse<ParentTask>>(uri);
    return response.data;
  }

  async getParentTaskList(searchKey?: string): Promise<ApiResponse<ParentTask[]>> {
    const params: { [key: string]: string } = {};

    if (searchKey) {
      params.searchKey = searchKey;
    }

    const uri = `${apiBaseUri}${endpoint_parentTask_get}`;
    const response = await axios.get<ApiResponse<ParentTask[]>>(uri, { params });
    return response.data;
  }

  async addParentTask(newParent: ParentTask): Promise<ApiResponse<ParentTask>> {
    const uri = `${apiBaseUri}${endpoint_parentTask_add}`;
    const response = await axios.post<ApiResponse<ParentTask>>(uri, newParent);
    return response.data;
  }
}