import { useToast } from "@chakra-ui/react";
import style from "./changePassword.module.css";
import { useParams } from "react-router-dom";
import proxy from "../../../proxy";
function ChangePassword() {
  const toast = useToast();
  const { token } = useParams();
  if (!token) {
    throw Error("Token is not Found");
  } else {
    (async function () {
      const response = await fetch(`${proxy}/auth/confirm?token=${token}`);
      if (response.status !== 200) {
        const { message } = await response.json();
        throw Error(message);
      }
    })();
  }

  const handleClick = async () => {
    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Password is not match",
        status: "error",
        position: "top-left",
        duration: 9000,
        isClosable: true,
      });
    } else {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: JSON.stringify({
          email: email,
        }),
      };

      const response = await fetch(
        `${proxy}/auth/forgetPassword`,
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
    }
  };
  return (
    <div className={style.container}>
      <form className={style.subContainer}>
        <div className={style.field}>
          <label>New Password</label>
          <input
            type="text"
            placeholder="Enter your new Password"
            name="newPassword"
            id="newPassword"
          />
        </div>
        <div className={style.field}>
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Enter your Confirm password"
            name="confirmPassword"
            id="confirmPassword"
          />
        </div>
        <div className={style.btnField}>
          <button className={style.changeButton} onClick={handleClick}>
            Change
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChangePassword;
