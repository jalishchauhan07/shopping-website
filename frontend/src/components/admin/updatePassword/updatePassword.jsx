import { useFormik } from "formik";
import { useToast } from "@chakra-ui/react";
import style from "./updatePassword.module.css";
import Menu from "../menu/menu";
import proxy from "../../../proxy";
import { useNavigate } from "react-router-dom";

function UpdatePassword() {
  const toast = useToast();
  const navigate = useNavigate();
  if (!localStorage.getItem("token")) {
    navigate("/login");
  }
  const formik = useFormik({
    initialValues: {
      newPassword: "",
      oldPassword: "",
    },
    onSubmit: async (values) => {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          newPassword: values.newPassword,
        }),
      };
      const response = await fetch(
        `${proxy}/auth/changePassword`,
        requestOptions
      );
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
      }
    },
  });
  return (
    <div className={style.container}>
      <Menu />
      <form className={style.subContainer}>
        <div className={style.field}>
          <label>Old Password</label>
          <input
            type="text"
            value={formik.values.oldPassword}
            onChange={formik.handleChange}
            placeholder="Enter your new Password"
            name="OldPassword"
            id="oldPassword"
          />
        </div>
        <div className={style.field}>
          <label>Confirm Password</label>
          <input
            type="password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            placeholder="Enter your Confirm password"
            name="newPassword"
            id="newPassword"
          />
        </div>
        <div className={style.btnField}>
          <button className={style.changeButton}>Change</button>
        </div>
      </form>
    </div>
  );
}

export default UpdatePassword;
