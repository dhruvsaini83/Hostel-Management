import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Student from "../components/student";
import Loading from "../components/loader.jsx";
import Message from "../components/message.jsx";
import { listStudents } from "../actions/studentActions";
import Paginate from "../components/paginate";
import {
  Row,
  Col,
  ButtonGroup,
  ToggleButton,
  Container,
  Button,
} from "react-bootstrap";
import StudentsTableView from "./studentTableView";

const HomeView = ({ match, history }) => {
  const [isGrid, setIsGrid] = useState(true);
  const keyword = match.params.keyword;

  const pageNumber = match.params.pageNumber || 1;
  const userLogin = useSelector((state) => state.userLogin);
  const { loading: userLoading, userInfo } = userLogin;

  const dispatch = useDispatch();

  const studentsList = useSelector((state) => state.studentsList);
  const { loading, error, students, page, pages } = studentsList;

  useEffect(() => {
    if (!userLoading && !userInfo) {
      history.push("/login");
      return;
    }

    if (userInfo) {
      dispatch(listStudents(keyword, pageNumber));
    }
  }, [dispatch, history, userInfo, userLoading, keyword, pageNumber]);

  return (
    <>
      <>
        <Container>
          <Row className="justify-content-center my-3">
            <Col xs="auto">
              <ButtonGroup toggle>
                {["Grid", "Table"].map((type) => (
                  <ToggleButton
                    key={type}
                    type="radio"
                    variant="secondary"
                    name="radio"
                    value={type}
                    checked={(isGrid ? "Grid" : "Table") === type}
                    onChange={(e) =>
                      setIsGrid(e.target.value === "Grid" ? true : false)
                    }
                  >
                    {type === "Grid" ? <> Grid</> : <> Table </>}
                  </ToggleButton>
                ))}
              </ButtonGroup>
            </Col>
          </Row>
        </Container>
      </>

      <h1>Students</h1>
      {loading ? (
        <Loading />
      ) : error ? (
        <Message variant="danger">{error} </Message>
      ) : students && students.length === 0 ? (
        <div className="text-center my-5">
          <h3>No students found</h3>
          <Button
            variant="primary"
            className="mt-3"
            onClick={() => history.push("/addStudent")}
          >
            Add Student
          </Button>
        </div>
      ) : isGrid ? (
        <>
          <Row>
            {students.map((student) => (
              <Col key={student._id} xs={12} sm={6} md={4} lg={3} xl={3}>
                <Student studentDetails={student} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={pages}
            page={page}
            keyword={keyword ? keyword : ""}
          />
        </>
      ) : (
        <>
          <StudentsTableView keyword={keyword} pageNumber={pageNumber} />
        </>
      )}
    </>
  );
};

export default HomeView;
