import { ParentTaskService } from "@app/services/parenttaskservice";
import { ParentTask } from "@app/services/tasktypes";
import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form } from "react-bootstrap";

interface ParentTaskSearchProps {
  show: boolean;
  handleClose: () => void;
  onPatentTaskSelect: (parenttask: ParentTask) => void;
}

const parenttaskService = new ParentTaskService();

const ParentTaskSearch: React.FC<ParentTaskSearchProps> = ({
  show,
  handleClose,
  onPatentTaskSelect,
}) => {
  const [parenttasks, setParentTasks] = useState<ParentTask[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [selectedParentTask, setSelectedParentTask] =
    useState<ParentTask | null>(null);
  const [enableAdd, setEnableAdd] = useState<boolean>(false);

  useEffect(() => {
    if (show) {
      fetchParentTasks();
    }
  }, [searchKey, show]);

  const fetchParentTasks = async () => {
    try {
      const response = await parenttaskService.getParentTaskList();
      const tasksdtls: ParentTask[] = response.Data;
      setParentTasks(tasksdtls);
    } catch (error) {
      console.error("Error fetching parenttasks:", error);
      setParentTasks([]); // Clear users on error
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
  };

  const handleParentTaskSelect = (parenttask: ParentTask) => {
    setSelectedParentTask(parenttask);
    setEnableAdd(true);
  };

  const handleAddParentTask = async () => {
    if (!selectedParentTask) return;
    onPatentTaskSelect(selectedParentTask);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Search Parent Task</Modal.Title>
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
        {parenttasks.length > 0 ? (
          <Table striped bordered hover>
            <thead className="table-primary">
              <tr>
                <th></th>
                <th>Parent Task</th>
              </tr>
            </thead>
            <tbody>
              {parenttasks.map((task) => (
                <tr key={task.Parent_ID}>
                  <td>
                    <Form.Check
                      type="radio"
                      name="parentID"
                      value={task.Parent_ID}
                      onChange={() => handleParentTaskSelect(task)}
                      checked={selectedParentTask?.Parent_ID === task.Parent_ID}
                    />
                  </td>
                  <td>{task.Parent_Task}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center">No tasks found for search criteria.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          disabled={!enableAdd}
          onClick={handleAddParentTask}
        >
          Add
        </Button>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ParentTaskSearch;
