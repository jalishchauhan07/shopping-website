import { useEffect, useState } from "react";
import Menu from "../../admin/menu/menu";
import style from "./product.module.css";
import proxy from "../../../proxy";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import UpdateProductModal from "../model/model";

function ProductList() {
  document.title = "Product";
  const navigate = useNavigate();
  if (!localStorage.getItem("token")) {
    navigate("/login");
  }
  const toast = useToast();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [products, setProduct] = useState();

  useEffect(() => {
    (async function () {
      const response = await fetch(`${proxy}/product/getProduct`);
      const data = await response.json();
      if (response.status === 200) {
        setProduct(data.products);
      }
    })();
  }, []);
  const handleUpdate = async (updatedProduct) => {
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
        productId: updatedProduct._id,
        ...updatedProduct,
      }),
    };
    const response = await fetch(
      `${proxy}/product/updateProduct`,
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
  async function handleBtn(event) {
    if (event.target.innerHTML === "Delete") {
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
          productId: products[event.target.id]._id,
        }),
      };
      const response = await fetch(
        `${proxy}/product/deleteProduct`,
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
        setProduct(
          products.filter((el, index) => index !== parseInt(event.target.id))
        );
      }
    }
  }
  return (
    <div className={style.container}>
      <div className={style.menu}>
        <Menu />
      </div>
      <div className={style.productList}>
        {products &&
          products.map((product, index) => (
            <div className={style.productItem} key={index}>
              <h3>{product.productName}</h3>
              <p>{product.description}</p>
              <p>{product.price}</p>
              <div className={style.btnField}>
                <button
                  id={index}
                  className={style.editBtn}
                  onClick={() => {
                    setSelectedProduct(product);
                    setModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  id={index}
                  onClick={handleBtn}
                  className={style.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
      <UpdateProductModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
        onUpdate={handleUpdate}
      />
    </div>
  );
}

export default ProductList;
