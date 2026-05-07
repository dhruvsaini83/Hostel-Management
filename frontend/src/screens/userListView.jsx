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
    if (userInfo && userInfo.role === 'admin') {
      dispatch(listUsers());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, successDelete, userInfo]);

  const deleteHandler = (id, email) => {
    if (email === 'admin@gmail.com') {
       alert("Super Admin account cannot be deleted.");
       return;
    }
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUser(id));
    }
  };

  // Filter out students as per requirements
  const filteredUsers = users ? users.filter(user => user.role !== 'student') : [];

  return (
    <div className='fade-in'>
      <h1 className='mb-1'>Administrative Users</h1>
      <p className='text-muted mb-4'>Manage Admin and Staff accounts. Students are managed in the main database.</p>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div className='premium-table-wrapper'>
          <Table hover responsive className="premium-table">
            <thead>
              <tr>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td className='font-weight-bold'>{user.name} {user.email === 'admin@gmail.com' && <i className="fas fa-star text-warning ml-1" title="Super Admin"></i>}</td>
                  <td>
                    <a href={`mailto:${user.email}`} className='table-link'>{user.email}</a>
                  </td>
                  <td>
                    <span className={`admin-badge badge-${user.role === 'admin' ? 'admin' : 'staff'} shadow-sm`}>
                      {user.role === 'admin' ? <i className="fas fa-crown mr-1"></i> : <i className="fas fa-user-shield mr-1"></i>} 
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-pill px-3 py-1 ${user.status === 'approved' ? 'bg-success text-white' : 'bg-warning text-dark'}`}>
                       {user.status || 'approved'}
                    </span>
                  </td>
                  <td>
                    {user.email !== 'admin@gmail.com' ? (
                      <>
                        <LinkContainer to={`/user/${user._id}/edit`}>
                          <Button variant="info" className="btn-sm rounded-pill px-3 mr-2 shadow-sm">
                            <i className="fas fa-edit mr-1"></i> Edit
                          </Button>
                        </LinkContainer>
                        <Button
                          variant="outline-danger"
                          className="btn-sm rounded-pill px-3 shadow-sm"
                          onClick={() => deleteHandler(user._id, user.email)}
                        >
                          <i className="fas fa-trash mr-1"></i> Delete
                        </Button>
                      </>
                    ) : (
                      <span className="text-muted small italic">Locked System Account</span>
                    )}
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
