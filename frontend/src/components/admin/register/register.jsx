import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import style from "./register.module.css";
import proxy from "../../../proxy";

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Required"),
});

function Register() {
  document.title = "Signup";
  const navigate = useNavigate();
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      username: "",
    },
    validationSchema: SignupSchema,
    onSubmit: async (values) => {
      // alert(JSON.stringify(values.email, null, 2));
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          username: values.username,
        }),
      };

      const response = await fetch(`${proxy}/auth/signup`, requestOptions);
      // console.log(response);
      const data = await response.json();
      if (response.status !== 200) {
        toast({
          title: "Error",
          description: data.message,
          status: "error",
          position: "top-left",
          duration: 9000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Success",
          description: data.message,
          status: "success",
          position: "top-left",
          duration: 9000,
          isClosable: true,
        });
        navigate("/login");
      }
    },
  });

  return (
    <div className={style.container}>
      <form className={style.subContainer} onSubmit={formik.handleSubmit}>
        <h3 className={style.h3}>
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="56"
            height="66"
            fill="currentColor"
            class="bi bi-person-circle"
            viewBox="0 0 16 16"
          >
            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
            <path
              fill-rule="evenodd"
              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
            />
          </svg>
        </h3>
        <div className={style.field}>
          <label>Username</label>
          <input
            type="text"
            onChange={formik.handleChange}
            value={formik.values.username}
            name="username"
            id="username"
          />
          {formik.touched.username && formik.errors.username ? (
            <div className={style.error}>{formik.errors.username}</div>
          ) : null}
        </div>
        <div className={style.field}>
          <label>Email Address</label>
          <input
            type="text"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            id="email"
          />
          {formik.touched.email && formik.errors.email ? (
            <div className={style.error}>{formik.errors.email}</div>
          ) : null}
        </div>
        <div className={style.field}>
          <label>Password</label>
          <input
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            name="password"
            id="password"
          />
          {formik.touched.password && formik.errors.password ? (
            <div className={style.error}>{formik.errors.password}</div>
          ) : null}
        </div>
        <div className={style.btnField}>
          <button type="submit" className={style.registerButton}>
            Register
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
