import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { ContentHeader } from "@components";
import { Project } from "@app/services/projecttypes";
import { ProjectService } from "@app/services/projectservice";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { customStyles, formatDate } from "@app/utils/helpers";

const projectService = new ProjectService();

const columns = (
  onEdit: (project: Project) => void,
  onDelete: (projectId: number) => void
) => [
  { name: "Project", selector: (row: any) => row.Project, sortable: true },
  { name: "Tasks", selector: (row: any) => row.NoOfTasks, sortable: true },
  {
    name: "Completed Tasks",
    selector: (row: any) => row.CompletedTasks,
    sortable: true,
  },
  {
    name: "Start Date",
    selector: (row: any) => formatDate(row.Start_Date),
    sortable: true,
  },
  {
    name: "End Date",
    selector: (row: any) => formatDate(row.End_Date),
    sortable: true,
  },
  {
    name: "Priority",
    selector: (row: any) => {
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
    name: "Actions",
    cell: (row: any) => (
      <div className="d-flex">
        <button onClick={() => onEdit(row)} className="btn btn-primary btn-sm">
          <i className="fa fa-edit" aria-hidden="true"></i>
        </button>
        <button
          onClick={() => onDelete(row.Project_ID)}
          className="btn btn-danger btn-sm ml-2"
        >
          <i className="fa fa-trash" aria-hidden="true"></i>
        </button>
      </div>
    ),
  },
];

const Projects = () => {
  const [filterText, setFilterText] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectService.getProjects();
      setProjects(response.Data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on the search text
  const filteredProjects = projects.filter((project) =>
    project.Project.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleEdit = async (project: Project) => {
    navigate("/editproject", { state: { project } });
  };

  const handleShowModal = (projectId: number) => {
    setSelectedProjectId(projectId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProjectId(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedProjectId) {
      try {
        await projectService.deleteProject(selectedProjectId);
        fetchProjects(); // Refresh project list
      } catch (error) {
        console.error("Error suspending project:", error);
      }
    }
    handleCloseModal();
  };

  const handleAddProject = () => {
    navigate("/addproject");
  };

  return (
    <div>
      <ContentHeader title="Projects" />
      {loading ? (
        <div>Loading...</div>
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
                  onClick={handleAddProject}
                  className="btn btn-success mt-2"
                >
                  <i className="fa fa-plus" aria-hidden="true"></i> Add Project
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
      {/* React-Bootstrap Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Suspension</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to suspend this project?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Suspend
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Projects;
