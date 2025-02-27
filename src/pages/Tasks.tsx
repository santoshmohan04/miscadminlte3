import { useState } from "react";
import DataTable from "react-data-table-component";
import { ContentHeader } from "@components";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Row,
  Form,
  Col,
  FormControl,
} from "react-bootstrap";
import { Task } from "@app/services/tasktypes";
import { TaskService } from "@app/services/taskservice";
import { Project } from "@app/services/projecttypes";
import ProjectsSearch from "./ProjectsSearch";
import { customStyles, formatDate } from "@app/utils/helpers";

const taskService = new TaskService();

const columns = (
  onEditTask: (task: Task) => void,
  onEndTask: (taskid:number) => void
) => [
  { name: "Task", selector: (row: Task) => row.Task, sortable: true },
  { name: "Parent", selector: (row: Task) => row.Parent && row.Parent.Parent_Task, sortable: true },
  {
    name: "Priority",
    selector: (row: Task) => {
      const priority = row.Priority;
      const progressValue = Math.min(Math.max(priority, 0), 30); // Ensure priority is between 0 and 30

      let color = "success"; // Default color (green)
      if (priority > 20)
        color = "danger"; // High priority, red
      else if (priority > 10) color = "warning"; // Medium priority, yellow

      return (
        <h3>
          <span className={`badge bg-${color}`}>{progressValue}</span>
        </h3>
      );
    },
    sortable: true,
  },
  {
    name: "Start Date",
    selector: (row: Task) => formatDate(row.Start_Date ?? ''),
    sortable: true,
  },
  {
    name: "End Date",
    selector: (row: Task) => formatDate(row.End_Date ?? ''),
    sortable: true,
  },
  {
    name: "Actions",
    cell: (row: Task) => (
        row && row.Status === 1 ? 'Completed' : (<div className="d-flex">
            <button onClick={() => onEditTask(row)} className="btn btn-primary btn-sm">
              <i className="fa fa-edit" aria-hidden="true"></i>
            </button>
            <button
              onClick={() => onEndTask(Number(row.Task_ID))}
              className="btn btn-danger btn-sm ml-2"
            >
              <i className="fa fa-trash" aria-hidden="true"></i>
            </button>
          </div>)
    )
  },
];

const Tasks = () => {
  const [filterText, setFilterText] = useState("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTaskList] = useState<Task[]>([]);
  const navigate = useNavigate();

  const fetchTasks = async (project:Project) => {
    try {
      const response = await taskService.getTasksList(project.Project_ID);
      setTaskList(response.Data);
    } catch (error) {
      console.error("Error fetching Tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on the search text
  const filteredProjects = tasks.filter((task) =>
    task.Task.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleEdit = async (task: Task) => {
    navigate("/edittask", { state: { task } });
  };

  const handleShowModal = (taskId: number) => {
    setSelectedProjectId(taskId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProjectId(null);
  };

  const handleAddTask = () => {
    navigate("/addtask");
  };

  const handleProjectSelect = (project: Project) => {
    setProject(project)
    setLoading(true);
    fetchTasks(project);
  };

  return (
    <div>
      <ContentHeader title="Tasks" />
      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Project Tasks</h3>
            </div>
            <div className="card-body">
              <Form noValidate>
                <Row className="form-group">
                  <Col md={2}>
                    <Form.Label htmlFor="project">Project:</Form.Label>
                  </Col>
                  <Col md={10}>
                    <Row>
                      <Col md={10} sm={12}>
                        <FormControl
                          type="text"
                          name="project"
                          className="form-control"
                          readOnly
                          value={project ? project.Project : ""}
                        />
                      </Col>
                      <Col md={2} sm={12}>
                        <Button
                          variant="default"
                          onClick={() => setShowModal(true)}
                        >
                          <span className="fa fa-search"></span> Search
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
        </div>
      </section>
      {loading ? (
        <div>Select Project...</div>
      ) : (
        <section className="content">
          <div className="container-fluid">
            <div className="card">
              <div className="card-header d-flex">
                <input
                  type="text"
                  placeholder="Search..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  className="form-control mt-2 custom-input mr-auto"
                />
                <button
                  onClick={handleAddTask}
                  className="btn btn-success mt-2"
                >
                  <i className="fa fa-plus" aria-hidden="true"></i> Add Task
                </button>
              </div>
              <div className="card-body">
                <DataTable
                  columns={columns(handleEdit, handleShowModal)} // Pass the edit and delete handlers
                  data={filteredProjects} // Use filtered projects here
                  pagination
                  highlightOnHover
                  responsive
                  customStyles={customStyles}
                />
              </div>
            </div>
          </div>
        </section>
      )}
      <ProjectsSearch
        show={showModal}
        handleClose={() => setShowModal(false)}
        onProjectSelect={handleProjectSelect}
      />
    </div>
  );
};

export default Tasks;
