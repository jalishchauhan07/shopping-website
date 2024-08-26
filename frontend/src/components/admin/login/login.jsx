import React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import style from "./login.module.css";
import proxy from "../../../proxy";
function Login() {
  const navigate = useNavigate();
  if (localStorage.getItem("token")) {
    navigate("/admin");
  }
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      };

      const response = await fetch(`${proxy}/auth/login`, requestOptions);
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", values.email);
        navigate("/admin/");
      }
    },
  });
  return (
    <div className={style.container}>
      <form className={style.subContainer} onSubmit={formik.handleSubmit}>
        <div className={style.field}>
          <label>Email Address</label>
          <input
            type="text"
            placeholder="Enter your email address"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            id="email"
          />
        </div>
        <div className={style.field}>
          <label>Password</label>
          <input
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            placeholder="Enter your password"
            name="password"
            id="password"
          />
        </div>
        <div className={style.btnField}>
          <button className={style.loginButton}>Login</button>
        </div>
        <div className={style.forgetField}>
          <a href="forgetPassword">Forget Password</a>
          <a href="register">Sign up</a>
        </div>
      </form>
    </div>
  );
}

export default Login;
