import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { ContentHeader } from "@components";
import { Project } from "@app/services/projecttypes";
import { ProjectService } from "@app/services/projectservice";

const projectService = new ProjectService();

// Utility function to format dates
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const columns = (
  onEdit: (project: Project) => void,
  onDelete: (projectId: number) => void
) => [
  {
    name: "Project Id",
    selector: (row: any) => row.Project_ID,
    sortable: true,
  },
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
  { name: "Priority", selector: (row: any) => row.Priority, sortable: true },
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
    // Implement your edit logic here, e.g., open a modal with a form
    console.log("Edit project:", project);
    try {
      await projectService.editProject(project);
      // Refresh the project list after deletion
      fetchProjects();
    } catch (error) {
      console.error("Error editing project:", error);
    }
    // You can call projectService.editProject here if needed
  };

  const handleDelete = async (projectId: number) => {
    if (window.confirm("Are you sure you want to suspend this project?")) {
      try {
        await projectService.deleteProject(projectId);
        // Refresh the project list after deletion
        fetchProjects();
      } catch (error) {
        console.error("Error suspending project:", error);
      }
    }
  };

  const handleAddProject = () => {
    // Implement your logic to add a new project, e.g., open a modal with a form
    console.log("Add new project");
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
                <button onClick={handleAddProject} className="btn btn-success mt-2">
                  <i className="fa fa-plus" aria-hidden="true"></i> Add Project
                </button>
              </div>
              <div className="card-body">
                <DataTable
                  columns={columns(handleEdit, handleDelete)} // Pass the edit and delete handlers
                  data={filteredProjects} // Use filtered projects here
                  pagination
                  highlightOnHover
                  responsive
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Projects;
