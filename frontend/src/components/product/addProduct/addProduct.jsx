import { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import style from "./addProject.module.css";
import proxy from "../../../proxy";
import { useFormik } from "formik";
import Menu from "../../admin/menu/menu";
import { useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();
  if (!localStorage.getItem("token")) {
    navigate("/login");
  }
  const toast = useToast();
  const formik = useFormik({
    initialValues: {
      productName: "",
      description: "",
      images: "",
      category: "",
      price: 0,
    },
    onSubmit: async () => {
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
          ...formik.values,
        }),
      };

      const response = await fetch(
        `${proxy}/product/addProduct`,
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
  const [Categorys, setCategorys] = useState(["Select your Category"]);
  useEffect(() => {
    (async function () {
      const response = await fetch(`${proxy}/product/getCategory`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      console.log(data);
      const tempData = [...data.categorys].map((el) => el.name);
      setCategorys([...Categorys, ...tempData]);
    })();
  }, []);

  return (
    <div className={style.container}>
      <div className={style.menu}>
        <Menu />
      </div>
      <form className={style.subContainer}>
        <div className={style.field}>
          <label>Product Name</label>
          <input
            type="text"
            name="productName"
            onChange={formik.handleChange}
            value={formik.values.productName}
            id="productName"
          />
        </div>
        <div className={style.field}>
          <label>Description</label>
          <input
            type="text"
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            id="description"
          />
        </div>
        <div className={style.field}>
          <label>Price</label>
          <input
            type="price"
            name="price"
            onChange={formik.handleChange}
            values={formik.values.price}
            id="price"
          />
        </div>
        <div className={style.field}>
          <label>Images</label>
          <input
            type="file"
            name="images"
            value={formik.values.images}
            id="images"
          />
        </div>
        <div className={style.field}>
          <label>Category</label>

          <select
            name="category"
            onChange={formik.handleChange}
            value={formik.values.category}
            id="category"
          >
            {Categorys &&
              Categorys.map((el, index) => {
                return <option key={index}>{el}</option>;
              })}
          </select>
        </div>
        <div className={style.btnField}>
          <button className={style.submitButton}>Submit</button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
