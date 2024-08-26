import React from "react";
import style from "./notFound.module.css"; // Import the CSS file

const NotFound = () => {
  return (
    <div className={style.not_found_container}>
      <h1 className={style.h1}>404</h1>
      <p className={style.p}>Page Not Found</p>
      <a className={style.a} href="/">
        Go to Homepage
      </a>
    </div>
  );
};

export default NotFound;
