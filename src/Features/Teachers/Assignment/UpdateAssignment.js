import React from "react";
import { useParams } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Button, TextField, Typography } from "@mui/material";
import styled from "@emotion/styled";

import { useUpdateAssignmentMutation } from "../teachersApiSlice";
import { CardWrapper } from "../../../Components/CardWrapper";
import Loading from "../../../Components/Loading";

const ValidationSchema = yup.object({
  id: yup.string().min(0, "Invalid id").required("Please enter id"),
  subject: yup
    .string()
    .min(2, "Please enter a valid subject")
    .required("Please enter the name of the subject"),
  description: yup
    .string()
    .min(4, "Please specify description")
    .required("Please enter the description of the task"),
  lds: yup
    .date()
    .min(new Date(Date.now()), "Please enter the last date of submission")
    .required("Please enter the last date of submission"),
  assignedBy: yup
    .string()
    .min(0, "Please enter your name")
    .required("Please enter your name"),
});

const StyledTypography = styled(Typography)(() => ({
  color: "red",
}));

export const UpdateAssignment = ({ data, id }) => {
  const { classId } = useParams();

  const [updateAssignment, { isLoading }] = useUpdateAssignmentMutation();

  const updateAssignmnt = (data) => {
    updateAssignment({ classId: classId, id: id, data })
      .unwrap()
      .then((response) => toast.success(response.message))
      .catch((error) => {
        const errorMessage =
          error?.error?.message ||
          error?.data?.error?.message ||
          "An error occurred.";
        toast.error(errorMessage);
      });
  };

  const formik = useFormik({
    initialValues: {
      id: data?.id,
      subject: data?.subject,
      description: data?.description,
      lds: dayjs(data?.lds),
      assignedBy: data?.assignedBy,
    },
    validationSchema: ValidationSchema,
    onSubmit: (values) => {
      updateAssignmnt(values); 
    },
  });

  return (
    <CardWrapper title="Update Assignment">
      <ToastContainer /> 
      {isLoading ? (
        <Loading open={isLoading} /> 
      ) : (
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginBottom: "30px",
          }}
          onSubmit={formik.handleSubmit}
        >
          {/* ---------- ID --------- */}
          <TextField
            id="id"
            value={formik.values.id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.id && Boolean(formik.errors.id)}
            helperText="SS1"
            label="Id"
            variant="standard"
          />
          <StyledTypography>
            {formik.touched.id && formik.errors.id ? formik.errors.id : ""}
          </StyledTypography>

          {/*  --------- Subject Name --------*/}
          <TextField
            id="subject"
            value={formik.values.subject}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.subject && Boolean(formik.errors.subject)}
            helperText="Maths"
            label="Subject"
            variant="standard"
          />
          <StyledTypography>
            {formik.touched.subject && formik.errors.subject
              ? formik.errors.subject
              : ""}
          </StyledTypography>

          {/* ---------- Description  ---------*/}
          <TextField
            id="description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.description && Boolean(formik.errors.description)
            }
            helperText="Task link or description"
            label="Description"
            variant="standard"
          />
          <StyledTypography>
            {formik.touched.description && formik.errors.description
              ? formik.errors.description
              : ""}
          </StyledTypography>

          {/* --- Last Date of Submission ----- */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Last date of submission"
              disablePast
              format="DD/MM/YYYY"
              value={formik.values.lds}
              onChange={(value) => formik.setFieldValue("lds", value, true)}
            />
          </LocalizationProvider>
          <StyledTypography>
            {formik.touched.lds && formik.errors.lds ? formik.errors.lds : ""}
          </StyledTypography>

          {/* ------- Assigned By ------*/}
          <TextField
            id="assignedBy"
            value={formik.values.assignedBy}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.assignedBy && Boolean(formik.errors.assignedBy)
            }
            helperText="John Doe"
            label="Assigned By"
            variant="standard"
          />
          <StyledTypography>
            {formik.touched.assignedBy && formik.errors.assignedBy
              ? formik.errors.assignedBy
              : ""}
          </StyledTypography>
          {/* ----- Submit Button ----- */}
          <Button
            variant="outlined"
            sx={{ color: "#4e73df", fontWeight: "600" }}
            type="submit"
            disabled={formik.isSubmitting} // Disable the button when submitting the form
          >
            Update Task
          </Button>
        </Box>
      )}
    </CardWrapper>
  );
};
