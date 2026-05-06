import React, { useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/message";
import Loader from "../components/loader";
import { listUsers, deleteUser } from "../actions/userActions";

const UserListView = ({ history }) => {
  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, error, users } = userList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userDelete = useSelector((state) => state.userDelete);
  const { success: successDelete } = userDelete;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listUsers());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, successDelete, userInfo]);

  const deleteHandler = (id) => {
    if (window.confirm("Are you sure")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className='fade-in'>
      <h1 className='mb-4'>Users</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className='premium-table-wrapper'>
          <Table hover responsive className="premium-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className='text-muted small'>{user._id}</td>
                  <td className='font-weight-bold'>{user.name}</td>
                  <td>
                    <a href={`mailto:${user.email}`} className='table-link'>{user.email}</a>
                  </td>
                  <td>
                    {user.isAdmin ? (
                      <span className='admin-badge badge-admin shadow-sm'>
                        <i className="fas fa-crown mr-1"></i> Admin
                      </span>
                    ) : (
                      <span className='admin-badge badge-user shadow-sm'>
                        User
                      </span>
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/user/${user._id}/edit`}>
                      <Button variant="info" className="btn-sm rounded-pill px-3 mr-2 shadow-sm">
                        <i className="fas fa-edit mr-1"></i> Edit
                      </Button>
                    </LinkContainer>
                    <Button
                      variant="outline-danger"
                      className="btn-sm rounded-pill px-3 shadow-sm"
                      onClick={() => deleteHandler(user._id)}
                    >
                      <i className="fas fa-trash mr-1"></i> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UserListView;
