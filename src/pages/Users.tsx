import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { ContentHeader } from "@components";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import { UserService } from "@app/services/userservice";
import { User } from "@app/services/usertypes";
import { customStyles } from "@app/utils/helpers";

const userService = new UserService();

const columns = (
  onEdit: (user: User) => void,
  onDelete: (userId: number) => void
) => [
  { name: "Employee ID", selector: (row: User) => row.Employee_ID, sortable: true },
  { name: "First Name", selector: (row: User) => row.First_Name, sortable: true },
  { name: "Last Name", selector: (row: User) => row.Last_Name, sortable: true },
  {
    name: "Actions",
    cell: (row: User) => (
      <div className="d-flex">
        <button onClick={() => onEdit(row)} className="btn btn-primary btn-sm">
          <i className="fa fa-edit" aria-hidden="true"></i>
        </button>
        <button
          onClick={() => onDelete(row.User_ID ?? 0)}
          className="btn btn-danger btn-sm ml-2"
        >
          <i className="fa fa-trash" aria-hidden="true"></i>
        </button>
      </div>
    ),
  },
];

const Users = () => {
  const [filterText, setFilterText] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    null
  );
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsersList();
      setUsers(response.Data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter projects based on the search text
  const filteredProjects = users.filter((user) =>
    user.First_Name.toLowerCase().includes(filterText.toLowerCase())
  );

  const handleEdit = async (user: User) => {
    navigate("/edituser", { state: { user } });
  };

  const handleConfirmDelete = async () => {
    if (selectedUserId) {
      try {
        await userService.deleteUser(selectedUserId);
        fetchUsers(); 
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
    handleCloseModal();
  };

  const handleShowModal = (userId: number) => {
    setSelectedUserId(userId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUserId(null);
  };

  const handleAddUser = () => {
    navigate("/adduser");
  };

  return (
    <div>
      <ContentHeader title="Users" />
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
                  onClick={handleAddUser}
                  className="btn btn-success mt-2"
                >
                  <i className="fa fa-plus" aria-hidden="true"></i> Add User
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
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
