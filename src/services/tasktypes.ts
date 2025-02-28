import { Project } from "./projecttypes"
import { User } from "./usertypes"

export interface Task {
    Task_ID?: number,
    Task: string,
    Status?: number,
    Start_Date?: string,
    End_Date?: string,
    Priority: number,
    User?:User,
    Parent?:ParentTask,
    Project?:Project
}

export interface ParentTask {
    Parent_ID?: number,
    Parent_Task: string,
    Project_ID?:number
}