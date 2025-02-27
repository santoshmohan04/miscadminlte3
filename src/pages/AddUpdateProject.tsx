import { useState, useEffect, useCallback } from "react";
import { ProjectService } from "@app/services/projectservice";
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
import { UserService } from "@app/services/userservice";

const projectService = new ProjectService();
const usersService = new UserService();

const AddUpdateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [priority, setPriority] = useState(0);
  const [setDates, setSetDates] = useState(false);
  const [manager, setManager] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  let project = state?.project;

  const patchProjectDtls = useCallback(async (data: Project) => {
    if (data) {
        setProjectName(data.Project);
        setPriority(data.Priority);
        if (data.Start_Date && data.End_Date) {
            setSetDates(true);
            setStartDate(moment(data.Start_Date).format('YYYY-MM-DD'));
            setEndDate(moment(data.End_Date).format('YYYY-MM-DD'));
        }
        if (data.Manager_ID) {
            try {
                const response = await usersService.getUser(data.Manager_ID);
                if (response.Success) {
                    setManager(response.Data);
                } else {
                    toast.error(response.Message);
                }
            } catch (error) {
                console.error("Error fetching User Details:", error);
            }
        }
    }
}, []);

  useEffect(() => {
    if (project) {
      patchProjectDtls(project);
    }
  }, [project, patchProjectDtls]);

    
  
  const DateParser = ({ value }: { value: string }) => {
    const date = moment(value, 'YYYY-MM-DD');
    return date.isValid() ? date.toDate() : null;
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

     // Parse and adjust the dates
     const parsedStartDate = DateParser({ value: moment(startDate).format('YYYY-MM-DD') });
     const parsedEndDate = DateParser({ value: moment(endDate).format('YYYY-MM-DD') });
 
     // Subtract one month from the parsed dates
     const adjustedStartDate = moment(parsedStartDate).subtract(1, 'months').toDate();
     const adjustedEndDate = moment(parsedEndDate).subtract(1, 'months').endOf('day').toDate();

    // Prepare form data
    const formData = {
      Project_ID: project ? project.Project_ID : null,
      Project: projectName,
      Priority: priority,
      Manager_ID: manager ? manager.User_ID : 0,
      Start_Date: adjustedStartDate.toDateString(), // Convert to Date object
      End_Date: adjustedEndDate.toDateString(), // Convert to Date object
    };

    console.log("Form Data Submitted:", formData);

    try {
        let response;
      if(project){
        response = await projectService.editProject(formData);
      } else {
        response = await projectService.addProject(formData);
      }
      
      if (response.Success === true) {
        toast.success(project ? "Project updated successfully." : "Project added successfully.");
        handleReset();
      } else {
        toast.error(response.Message);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleReset = () => {
    setProjectName("");
    setStartDate("");
    setEndDate("");
    setPriority(0);
    setSetDates(false);
    setManager(null);
  };

  const handleCancel = () => {
    navigate("/projects");
  };

  const handleUserSelect = (user: any) => {
    setManager(user);
    console.log("Selected User:", user);
  };

  return (
    <div>
      <ContentHeader title={project ? "Update Project" : "Add Project"} />
      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Enter Project Details</h3>
            </div>
            <div className="card-body">
              <Form noValidate>
                <Row className="form-group">
                  <Col md={2}>
                    <Form.Label htmlFor="projectName">Project Name:</Form.Label>
                  </Col>
                  <Col md={10}>
                    <FormControl
                      type="text"
                      name="projectName"
                      className="form-control"
                      required
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
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
                          label="Set Start and End Date"
                          checked={setDates}
                          onChange={(e) => setSetDates(e.target.checked)}
                        />
                      </Col>
                      <Col md={4} sm={12}>
                        <FormControl
                          type="date"
                          name="startDate"
                          className="form-control"
                          disabled={!setDates}
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                      </Col>
                      <Col md={4} sm={12}>
                        <FormControl
                          type="date"
                          name="endDate"
                          className="form-control"
                          disabled={!setDates}
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
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
                      onChange={(e) => setPriority(Number(e.target.value))}
                      style={{ padding: 0 }}
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={2}>
                    <Form.Label htmlFor="manager">Manager:</Form.Label>
                  </Col>
                  <Col md={10}>
                    <Row>
                      <Col md={10} sm={12}>
                        <FormControl
                          type="text"
                          name="manager"
                          className="form-control"
                          readOnly
                          value={manager ? manager.Full_Name : ""}
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
            <div className="card-footer">
              <div className="form-group d-flex justify-content-end">
                <Button
                  type="button"
                  className="btn btn-success mr-2"
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
                {project ? null : <Button
                  type="button"
                  className="btn btn-primary mr-2"
                  onClick={handleReset}
                >
                  Reset
                </Button>}
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
        show={showModal}
        handleClose={() => setShowModal(false)}
        onUserSelect={handleUserSelect}
      />
    </div>
  );
};

export default AddUpdateProject;
