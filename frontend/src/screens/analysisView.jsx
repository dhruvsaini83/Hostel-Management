

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
    <div className="fade-in">
      <Row className="justify-content-between align-items-center mb-4">
        <Col>
          <Link to="/" className="btn btn-light shadow-sm rounded-pill px-3">
            <i className="fas fa-arrow-left mr-2"></i> Go Back
          </Link>
        </Col>

        <Col className="text-right">
          <Button
            variant="outline-danger"
            className="rounded-pill px-3"
            size="sm"
            onClick={() => setModal(true)}
          >
            <i className="fas fa-trash-alt mr-2"></i> Delete Attendance
          </Button>
        </Col>
      </Row>

      {loadingDelete && <Loading />}
      {errorDelete && <Message variant="danger">{errorDelete}</Message>}
      {successDelete && (
        <Message variant="success">Attendance Deleted</Message>
      )}

      <Row>
        <Col md={12}>
          <div className="bg-white p-4 rounded shadow-sm mb-4">
            <Row className="align-items-center">
              <Col md={12} lg={6} className="mb-3 mb-lg-0">
                <div className="d-flex align-items-center">
                  <Button 
                    variant="light" 
                    className="rounded-circle shadow-sm p-2 mr-3"
                    onClick={() => {
                      const prev = new Date(startDate);
                      prev.setDate(prev.getDate() - 1);
                      setStartDate(prev);
                    }}
                  >
                    <i className="fas fa-chevron-left"></i>
                  </Button>
                  
                  <div>
                    <h5 className="mb-0 text-muted small text-uppercase letter-spacing-1">Analysis for</h5>
                    <h3 className="font-weight-bold text-primary mb-0">{formattedDate}</h3>
                  </div>

                  <Button 
                    variant="light" 
                    className="rounded-circle shadow-sm p-2 ml-3"
                    onClick={() => {
                      const next = new Date(startDate);
                      next.setDate(next.getDate() + 1);
                      setStartDate(next);
                    }}
                  >
                    <i className="fas fa-chevron-right"></i>
                  </Button>
                </div>
              </Col>

              <Col md={12} lg={6} className="d-flex justify-content-lg-end align-items-center">
                <div className="mr-2 mr-md-3">
                  <DatePicker
                    selected={startDate}
                    onChange={handleDateChange}
                    className="form-control premium-input shadow-sm"
                  />
                </div>
                <Button 
                  variant="primary" 
                  className="rounded-pill px-4 shadow-sm premium-btn"
                  onClick={() => dispatch(getAnalysisByDate(formattedDate))}
                >
                  <i className="fas fa-sync-alt mr-2"></i> Refresh
                </Button>
              </Col>
            </Row>
          </div>

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

          <AnalysisComponent />
        </Col>
      </Row>
    </div>
  );
};

export default AnalysisView;