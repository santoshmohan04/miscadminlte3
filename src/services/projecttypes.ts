import { Task } from "./tasktypes";

export interface Project {
    Project_ID?: number,
    Project: string,
    Start_Date?: string,
    End_Date?: string,
    Priority: number,
    Manager_ID?:number,
    Tasks?: Task[]
}