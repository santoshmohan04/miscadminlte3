import { ParentTaskService } from '@app/services/parenttaskservice';
import { ProjectService } from '@app/services/projectservice';
import { Project } from '@app/services/projecttypes';
import { ApiResponse } from '@app/services/sharedtypes';
import { ParentTask } from '@app/services/tasktypes';
import { UserService } from '@app/services/userservice';
import { User } from '@app/services/usertypes';
import { ContentHeader } from '@components';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

const userService = new UserService();
const projectService = new ProjectService();
const parenttaskService = new ParentTaskService();

const Dashboard = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<ParentTask[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const fetchStatisticsData = async () => {
    try {
      const [projectRes, taskRes, userRes]: [
        ApiResponse<Project[]>,
        ApiResponse<ParentTask[]>,
        ApiResponse<User[]>
      ] = await Promise.all([
        projectService.getProjects(),
        parenttaskService.getParentTaskList(),
        userService.getUsersList(),
      ]);

      setProjects(projectRes.Data || []);
      setTasks(taskRes.Data || []);
      setUsers(userRes.Data || []);
    } catch (error) {
      console.error("Error fetching statistics data:", error);
    }
  };

  useEffect(() => {
    fetchStatisticsData();
  }, []);

  return (
    <div>
      <ContentHeader title="Dashboard" />

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-3 col-6">
              <div className="small-box bg-info">
                <div className="inner">
                  <h3>{projects.length}</h3>

                  <p>Projects</p>
                </div>
                <div className="icon">
                  <i className="fas fa-project-diagram" />
                </div>
                <Link to="/projects" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right" />
                </Link>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-success">
                <div className="inner">
                  <h3>
                    {tasks.length}
                  </h3>

                  <p>Tasks</p>
                </div>
                <div className="icon">
                  <i className="fas fa-tasks" />
                </div>
                <Link to="/tasks" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right" />
                </Link>
              </div>
            </div>
            <div className="col-lg-3 col-6">
              <div className="small-box bg-warning">
                <div className="inner">
                  <h3>
                    {users.length}
                  </h3>

                  <p>User Registrations</p>
                </div>
                <div className="icon">
                  <i className="ion ion-person-add" />
                </div>
                <Link to="/users" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right" />
                </Link>
              </div>
            </div>
            {/* <div className="col-lg-3 col-6">
              <div className="small-box bg-danger">
                <div className="inner">
                  <h3>65</h3>

                  <p>Unique Visitors</p>
                </div>
                <div className="icon">
                  <i className="ion ion-pie-graph" />
                </div>
                <a href="/" className="small-box-footer">
                  More info <i className="fas fa-arrow-circle-right" />
                </a>
              </div>
            </div> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
