import { Project } from "@app/services/projecttypes";
import { ProjectService } from "@app/services/projectservice";
import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";

interface ProjectsSearchProps {
  show: boolean;
  handleClose: () => void;
  onProjectSelect: (user: Project) => void;
}

const projectService = new ProjectService();

const ProjectsSearch: React.FC<ProjectsSearchProps> = ({
  show,
  handleClose,
  onProjectSelect,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [selectedProjectID, setSelectedProjectID] = useState<number | null>(null);
  const [enableAdd, setEnableAdd] = useState<boolean>(false);

  useEffect(() => {
    if (show) {
      fetchProjects();
    }
  }, [searchKey, show]);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getProjects();
      const projectslist: Project[] = response.Data;
      setProjects(projectslist);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]); // Clear users on error
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
  };

  const handleProjectSelect = (projectID: number) => {
    setSelectedProjectID(projectID);
    setEnableAdd(true);
  };

  const handleAddProject = async () => {
    if (!selectedProjectID) return;

    try {
        const response = await projectService.getProject(selectedProjectID);
        const projectdtls: Project = response.Data;
        onProjectSelect(projectdtls);
        handleClose();
      } catch (error) {
        console.error("Error fetching project details:", error);
      }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Search Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Search.."
            value={searchKey}
            onChange={handleSearchChange}
          />
        </Form.Group>
        <br />
        {projects.length > 0 ? (
          <Table striped bordered hover>
            <thead className="table-primary">
              <tr>
                <th></th>
                <th>Project</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.Project_ID}>
                  <td>
                    <Form.Check
                      type="radio"
                      name="userID"
                      value={project.Project_ID}
                      onChange={() => handleProjectSelect(Number(project.Project_ID))}
                      checked={selectedProjectID === project.Project_ID}
                    />
                  </td>
                  <td>{project.Project}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center">No project found for search criteria.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" disabled={!enableAdd} onClick={handleAddProject}>
          Add
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProjectsSearch;
