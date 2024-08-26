import { useNavigate } from "react-router-dom";
import Menu from "../menu/menu";
import SalesOrderChart from "./sales/sales";

import style from "./dashboard.module.css";

function Dashboard() {
  const navigate = useNavigate();
  if (!localStorage.getItem("token")) {
    navigate("/login");
  }
  return (
    <div className={style.dashboardContainer}>
      <div className={style.menu}>
        <Menu />
      </div>
      <div className={style.chart}>
        <SalesOrderChart />
      </div>
    </div>
  );
}

export default Dashboard;
