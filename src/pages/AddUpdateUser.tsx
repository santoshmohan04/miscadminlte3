import { useState, useEffect, useCallback } from "react";
import { Form, Row, Col, Button, FormControl } from "react-bootstrap";
import { ContentHeader } from "@components";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "@app/services/usertypes";
import { toast } from "react-toastify";
import { UserService } from "@app/services/userservice";

const usersService = new UserService();

const AddUpdateUserDetails = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeID, setEmployeeID] = useState("");
  const [isModified, setIsModified] = useState(false);
  const [employeeIDError, setEmployeeIDError] = useState("");

  const { state } = useLocation();
  const navigate = useNavigate();
  let selectedUserDetails = state?.user;

  const patchUserDtls = useCallback(async (data: User) => {
    if (data) {
      setFirstName(data.First_Name);
      setLastName(data.Last_Name);
      setEmployeeID(data.Employee_ID.toString());
      setIsModified(false);
    }
  }, []);

  useEffect(() => {
    if (selectedUserDetails) {
      patchUserDtls(selectedUserDetails);
    }
  }, [selectedUserDetails, patchUserDtls]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    // Validate Employee ID
    if (!employeeID) {
      setEmployeeIDError("Employee ID is required.");
      return;
    } else if (!/^\d{6}$/.test(employeeID)) {
      setEmployeeIDError("Employee ID must be 6 digits long.");
      return;
    } else {
      setEmployeeIDError("");
    }

    const formData = {
      User_ID: selectedUserDetails ? selectedUserDetails.User_ID : null,
      First_Name: firstName,
      Last_Name: lastName,
      Employee_ID: Number(employeeID),
    };

    try {
      let response;
      if (selectedUserDetails) {
        response = await usersService.editUser(formData);
      } else {
        response = await usersService.addUser(formData);
      }

      if (response.Success === true) {
        toast.success(
          selectedUserDetails
            ? "User details updated successfully."
            : "User details added successfully."
        );
        handleReset();
      } else {
        toast.error(response.Message);
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const handleReset = () => {
    setFirstName("");
    setLastName("");
    setEmployeeID("");
    setIsModified(false);
    setEmployeeIDError("");
  };

  const handleCancel = () => {
    navigate("/users");
  };

  return (
    <div>
      <ContentHeader title={selectedUserDetails ? "Update User" : "Add User"} />
      <section className="content">
        <div className="container-fluid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Enter User Details</h3>
            </div>
            <div className="card-body">
              <Form noValidate>
                <Row className="form-group">
                  <Col md={2}>
                    <Form.Label htmlFor="firstName">First Name:</Form.Label>
                  </Col>
                  <Col md={10}>
                    <FormControl
                      type="text"
                      name="firstName"
                      className="form-control"
                      required
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        setIsModified(true);
                      }}
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={2}>
                    <Form.Label htmlFor="lastName">Last Name:</Form.Label>
                  </Col>
                  <Col md={10}>
                    <FormControl
                      type="text"
                      name="lastName"
                      className="form-control"
                      required
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        setIsModified(true);
                      }}
                    />
                  </Col>
                </Row>
                <Row className="form-group">
                  <Col md={2}>
                    <Form.Label htmlFor="employeeID">Employee ID:</Form.Label>
                  </Col>
                  <Col md={10}>
                    <FormControl
                      type="text"
                      name="employeeID"
                      className="form-control"
                      maxLength={6}
                      required
                      value={employeeID}
                      onChange={(e) => {
                        setEmployeeID(e.target.value.replace(/\D/, "")); // Allow only numbers
                        setIsModified(true);
                      }}
                      onBlur={() => {
                        if (!employeeID) {
                          setEmployeeIDError("Employee ID is required.");
                        } else if (!/^\d{6}$/.test(employeeID)) {
                          setEmployeeIDError("Employee ID must be 6 digits long.");
                        } else {
                          setEmployeeIDError("");
                        }
                      }}
                    />
                    {employeeIDError && (
                      <div className="text-danger">{employeeIDError}</div>
                    )}
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
                {(!selectedUserDetails && isModified) && (
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
    </div>
  );
};

export default AddUpdateUserDetails;