import { useState, useEffect, useCallback } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  FormControl,
  FormCheck,
} from "react-bootstrap";
import { ContentHeader } from "@components";
import { useNavigate, useLocation } from "react-router-dom";
import UsersSearch from "./UsersSearch";
import { User } from "@app/services/usertypes";
import { toast } from "react-toastify";
import moment from "moment";
import { Project } from "@app/services/projecttypes";
import { ParentTask, Task } from "@app/services/tasktypes";
import ProjectsSearch from "./ProjectsSearch";
import ParentTaskSearch from "./ParentTasksSearch";
import { ParentTaskService } from "@app/services/parenttaskservice";
import { TaskService } from "@app/services/taskservice";

const parenttaskService = new ParentTaskService();
const taskService = new TaskService();

const AddUpdateTask = () => {
  const [project, setProject] = useState<Project | null>(null);
  const [task, setTask] = useState("");
  const [isParentTask, setIsParentTask] = useState(false);
  const [priority, setPriority] = useState(0);
  const [parenttask, setParenttask] = useState<ParentTask | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showParentTaskModal, setShowParentTaskModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  let taskdtls = state?.task;

  const patchTaskDtls = useCallback(async (data: Task) => {
    if (data) {
      setProject(data.Project ?? null);
      setTask(data.Task);
      setPriority(data.Priority);
      setParenttask(data.Parent ?? null);
      if (data.Start_Date && data.End_Date) {
        setStartDate(moment(data.Start_Date).format("YYYY-MM-DD"));
        setEndDate(moment(data.End_Date).format("YYYY-MM-DD"));
      }
      setUser(data.User ?? null);
    }
  }, []);

  useEffect(() => {
    if (taskdtls) {
      patchTaskDtls(taskdtls);
    }
  }, [taskdtls, patchTaskDtls]);

  const DateParser = ({ value }: { value: string }) => {
    const date = moment(value, "YYYY-MM-DD");
    return date.isValid() ? date.toDate() : null;
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // Parse and adjust the dates
    const parsedStartDate = DateParser({
      value: moment(startDate).format("YYYY-MM-DD"),
    });
    const parsedEndDate = DateParser({
      value: moment(endDate).format("YYYY-MM-DD"),
    });

    // Subtract one month from the parsed dates
    const adjustedStartDate = moment(parsedStartDate)
      .subtract(1, "months")
      .toDate();
    const adjustedEndDate = moment(parsedEndDate)
      .subtract(1, "months")
      .endOf("day")
      .toDate();

    if (isParentTask) {
      const formData = {
        Parent_Task: parenttask?.Parent_Task ?? "",
        Project_ID: project?.Project_ID,
      };
      try {
        const response = await parenttaskService.addParentTask(formData);
        if (response.Success === true) {
          toast.success("Parent Task added successfully.");
          handleReset();
        } else {
          toast.error(response.Message);
        }
      } catch (error) {
        console.error("Error updating parent task:", error);
      }
    } else {
      const formData = {
        Task: task,
        Priority: priority,
        Start_Date: adjustedStartDate.toDateString(),
        End_Date: adjustedEndDate.toDateString(),
      };
      try {
        const response = await taskService.addTask(formData);
        if (response.Success === true) {
          toast.success("Parent Task added successfully.");
          handleReset();
        } else {
          toast.error(response.Message);
        }
      } catch (error) {
        console.error("Error updating parent task:", error);
      }
    }
  };

  const handleReset = () => {
    setProject(null);
    setTask("");
    setPriority(0);
    setParenttask(null);
    setStartDate("");
    setEndDate("");
    setUser(null);
  };

  const handleCancel = () => {
    navigate("/tasks");
  };

  const handleUserSelect = (user: User) => {
    setUser(user);
  };

  const handleProjectSelect = (project: Project) => {
    setProject(project);
  };

  const handleParentTaskSelect = (task: ParentTask) => {
    setParenttask(task);
  };

  return (
    <div>
      <ContentHeader title={project ? "Update Task" : "Add Task"} />
      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Enter Details</h3>
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
                          onClick={() => setShowProjectModal(true)}
                        >
                          <span className="fa fa-search"></span> Search
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={2}>
                    <Form.Label htmlFor="task">Task:</Form.Label>
                  </Col>
                  <Col md={10}>
                    <FormControl
                      type="text"
                      name="task"
                      className="form-control"
                      required
                      value={task}
                      onChange={(e) => setTask(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={2}></Col>
                  <Col md={10}>
                    <Row>
                      <Col md={4} sm={12}>
                        <FormCheck
                          type="checkbox"
                          label="Parent Task"
                          checked={isParentTask}
                          disabled = {taskdtls}
                          onChange={(e) => setIsParentTask(e.target.checked)}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={2}>
                    <Form.Label htmlFor="priority">Priority:</Form.Label>
                  </Col>
                  <Col md={10}>
                    <FormControl
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      name="priority"
                      className="form-control"
                      value={priority}
                      disabled={isParentTask}
                      onChange={(e) => setPriority(Number(e.target.value))}
                      style={{ padding: 0 }}
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={2}>
                    <Form.Label htmlFor="parenttask">Parent Task:</Form.Label>
                  </Col>
                  <Col md={10}>
                    <Row>
                      <Col md={10} sm={12}>
                        <FormControl
                          type="text"
                          name="parenttask"
                          className="form-control"
                          disabled={isParentTask || !project}
                          readOnly
                          value={parenttask ? parenttask.Parent_Task : ""}
                        />
                      </Col>
                      <Col md={2} sm={12}>
                        <Button
                          variant="default"
                          onClick={() => setShowParentTaskModal(true)}
                          disabled={isParentTask || !project}
                        >
                          <span className="fa fa-search"></span> Search
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={2}>
                    <Form.Label htmlFor="startDate">Start Date:</Form.Label>
                  </Col>
                  <Col md={4} sm={12}>
                    <FormControl
                      type="date"
                      name="startDate"
                      className="form-control"
                      disabled={isParentTask}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Col>
                  <Col md={2}>
                    <Form.Label htmlFor="endDate">End Date:</Form.Label>
                  </Col>
                  <Col md={4} sm={12}>
                    <FormControl
                      type="date"
                      name="endDate"
                      className="form-control"
                      disabled={isParentTask}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={2}>
                    <Form.Label htmlFor="user">User:</Form.Label>
                  </Col>
                  <Col md={10}>
                    <Row>
                      <Col md={10} sm={12}>
                        <FormControl
                          type="text"
                          name="user"
                          className="form-control"
                          readOnly
                          value={user ? user.Full_Name : ""}
                        />
                      </Col>
                      <Col md={2} sm={12}>
                        <Button
                          variant="default"
                          onClick={() => setShowUserModal(true)}
                        >
                          <span className="fa fa-search"></span> Search
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Form>
            </div>
            <div className="card-footer">
              <div className="form-group d-flex justify-content-end">
                <Button
                  type="button"
                  className="btn btn-success mr-2"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                {project ? null : (
                  <Button
                    type="button"
                    className="btn btn-primary mr-2"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                )}
                <Button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <UsersSearch
        show={showUserModal}
        handleClose={() => setShowUserModal(false)}
        onUserSelect={handleUserSelect}
      />
      <ProjectsSearch
        show={showProjectModal}
        handleClose={() => setShowProjectModal(false)}
        onProjectSelect={handleProjectSelect}
      />
      <ParentTaskSearch
        show={showParentTaskModal}
        handleClose={() => setShowParentTaskModal(false)}
        onPatentTaskSelect={handleParentTaskSelect}
      />
    </div>
  );
};

export default AddUpdateTask;
