

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Button, Modal, Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";
import "react-datepicker/dist/react-datepicker.css";

import {
  deleteAttendanceByDate,
  getAnalysisByDate,
} from "../actions/attendanceActions";

import AnalysisComponent from "../components/analysisComponent";
import Loading from "../components/loader";
import Message from "../components/message";

const AnalysisView = () => {
  const dispatch = useDispatch();

  const [modal, setModal] = useState(false);
  const [days, setDays] = useState("");
  const [startDate, setStartDate] = useState(new Date());


  const {
    loading: loadingDelete,
    success: successDelete,
    error: errorDelete,
  } = useSelector((state) => state.attendanceDelete);

  // 👇 IMPORTANT: keep backend-compatible format
  const formattedDate = useMemo(() => {
    return startDate ? startDate.toDateString() : "";
  }, [startDate]);

  useEffect(() => {
    dispatch(getAnalysisByDate(formattedDate));
  }, [dispatch, formattedDate]);

  useEffect(() => {
    if (successDelete) {
      dispatch(getAnalysisByDate(formattedDate));
    }
  }, [successDelete, dispatch, formattedDate]);

  useEffect(() => {
    if (successDelete) {
      setDays("");
    }
  }, [successDelete]);

  const handleDateChange = (date) => {
    if (!date) return;
    setStartDate(date);
  };

  const handleDelete = () => {
    const numericDays = Number(days);
    if (!numericDays || numericDays <= 0) return;

    dispatch(deleteAttendanceByDate(numericDays));
    setModal(false);
    setDays("");
  };



  return (
    <>
      <Row className="justify-content-between align-items-center">
        <Link to="/" className="btn btn-light my-3">
          Go Back
        </Link>

        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => setModal(true)}
        >
          Delete Attendance
        </Button>
      </Row>

      {loadingDelete && <Loading />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {successDelete && (
        <Message variant="success">Attendance Deleted</Message>
      )}

      <Col>
        <Row className="align-items-center mb-3">
          <Col>
            <h5 className="mb-0">Analysis for</h5>
            <strong>{formattedDate}</strong>
          </Col>

          <Col className="text-end">
            <DatePicker
              selected={startDate}
              onChange={handleDateChange}
              className="form-control"
            />
          </Col>
        </Row>

        <Modal show={modal} onHide={() => setModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>
              Delete Attendance Older Than N Days
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <Form.Group controlId="days">
              <Form.Label>Enter days</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setModal(false)}>
              Cancel
            </Button>
            <Button
              variant="outline-danger"
              onClick={handleDelete}
              disabled={loadingDelete}
            >
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Keep original usage */}
        <AnalysisComponent />
      </Col>
    </>
  );
};

export default AnalysisView;