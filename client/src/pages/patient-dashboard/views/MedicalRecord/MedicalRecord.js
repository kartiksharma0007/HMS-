import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { useState, useEffect } from "react";
import { useAuthContext } from "../../../../hooks/useAuthContext";
import api from "../../../../api/axios";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

function Row(props) {
  const { record } = props;
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell align="right" component="th" scope="row">
          {record._id}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Appointment Details
              </Typography>
              <Table size="small" aria-label="purchases" sx={{ mb: 5 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Clinic Number</TableCell>
                    <TableCell align="left">Date & Time</TableCell>
                    <TableCell align="left">Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="left">{record.appointment_details.clinicNumber}</TableCell>
                    <TableCell align="left">{new Date(record.appointment_details.date).toUTCString()}</TableCell>
                    <TableCell align="left">{record.appointment_details.description}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Prescription Details
              </Typography>
              <Table size="small" aria-label="purchases" sx={{ mb: 5 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Doctor Comment</TableCell>
                    <TableCell align="left">Medicines</TableCell>
                    <TableCell align="left">Given By</TableCell>
                    <TableCell align="left">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="left">{record.prescription.doctor_comments}</TableCell>
                    <TableCell align="left">
                      {record.prescription.medicines.map(medicine => medicine.name + ", ")}
                    </TableCell>
                    <TableCell align="left">{record.prescription.given_by}</TableCell>
                    <TableCell align="left">{new Date(record.prescription.date).toDateString()}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Test Reports Details
              </Typography>
              <Table size="small" aria-label="purchases" sx={{ mb: 5 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Comments</TableCell>
                    <TableCell align="left">Tests & Results</TableCell>
                    <TableCell align="left">Generated By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="left">{record.test_report.comments}</TableCell>
                    <TableCell align="left">
                      {record.test_report.tests.map(test => test.name + "-" + test.result + ", ")}
                    </TableCell>
                    <TableCell align="left">{record.test_report.generated_by}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Payment Details
              </Typography>
              <Table size="small" aria-label="purchases" sx={{ mb: 5 }}>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Total</TableCell>
                    <TableCell align="left">Bill Items</TableCell>
                    <TableCell align="left">Issue Date</TableCell>
                    <TableCell align="left">Due Date</TableCell>
                    <TableCell align="left">Tax Rate</TableCell>
                    <TableCell align="left">Generated By</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="left">{record.payment_details.total}</TableCell>
                    <TableCell align="left">
                      {record.payment_details.bill_items.map(
                        bill_item => bill_item.name + "-" + bill_item.price + "/-, "
                      )}
                    </TableCell>
                    <TableCell align="left">{new Date(record.payment_details.issue_date).toDateString()}</TableCell>
                    <TableCell align="left">{new Date(record.payment_details.due_date).toDateString()}</TableCell>
                    <TableCell align="left">{record.payment_details.tax_rate}</TableCell>
                    <TableCell align="left">{record.payment_details.generated_by}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function MedicalRecord() {
  const { user } = useAuthContext();
  const [records, setRecords] = useState([]);
  const id = user.id;
  useEffect(async () => {
    const response = await api.get(`/patient/history/${encodeURIComponent(id)}`).then(userData => {
      setRecords(userData.data.medical_records);
    });
  }, []);
  return (
    <Grid item xs={12} md={12} lg={12}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "auto",
        }}
      >
        <h2 className="dashboard-title">Medical Record</h2>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell align="right" className="record-main">
                  Record ID
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records && records.map((record, index) => <Row align="left" key={index} record={record} />)}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Grid>
  );
}
