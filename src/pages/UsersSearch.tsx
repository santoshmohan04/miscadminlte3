import { UserService } from "@app/services/userservice";
import { User } from "@app/services/usertypes";
import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";

interface UsersSearchProps {
  show: boolean;
  handleClose: () => void;
  onUserSelect: (user: User) => void;
}

const userService = new UserService();

const UsersSearch: React.FC<UsersSearchProps> = ({
  show,
  handleClose,
  onUserSelect,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [selectedUserID, setSelectedUserID] = useState<number | null>(null);
  const [enableAdd, setEnableAdd] = useState<boolean>(false);

  useEffect(() => {
    if (show) {
      fetchUsers();
    }
  }, [searchKey, show]);

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsersList();
      const users: User[] = response.Data;
      setUsers(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]); // Clear users on error
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
  };

  const handleUserSelect = (userID: number) => {
    setSelectedUserID(userID);
    setEnableAdd(true);
  };

  const handleAddUser = async () => {
    if (!selectedUserID) return;

    try {
        const response = await userService.getUser(selectedUserID);
        const user: User = response.Data;
        onUserSelect(user);
        handleClose();
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Search Manager</Modal.Title>
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
        {users.length > 0 ? (
          <Table striped bordered hover>
            <thead className="table-primary">
              <tr>
                <th></th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Employee ID</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.User_ID}>
                  <td>
                    <Form.Check
                      type="radio"
                      name="userID"
                      value={user.User_ID}
                      onChange={() => handleUserSelect(Number(user.User_ID))}
                      checked={selectedUserID === user.User_ID}
                    />
                  </td>
                  <td>{user.First_Name}</td>
                  <td>{user.Last_Name}</td>
                  <td>{user.Employee_ID}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center">No users found for search criteria.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" disabled={!enableAdd} onClick={handleAddUser}>
          Add
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UsersSearch;
