import { useToast } from "@chakra-ui/react";
import style from "./forgetPassword.module.css";
import proxy from "../../../proxy";

function ForgetPassword() {
  const toast = useToast();
  const handleClick = async () => {
    const email = document.getElementById("email").value;
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
  };
  return (
    <div className={style.container}>
      <div className={style.subContainer}>
        <div className={style.field}>
          <label>Email Address</label>
          <input
            type="text"
            placeholder="Enter your email address"
            name="email"
            id="email"
          />
        </div>
        <div className={style.btnField}>
          <button className={style.sendButton} onClick={handleClick}>
            Send Link
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
