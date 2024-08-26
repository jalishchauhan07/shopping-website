import { useEffect, useState } from "react";
import style from "./dashboard.module.css";
import proxy from "../proxy";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [productInfo, setProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const navigate = useNavigate();
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  };

  const handleCategoryChange = async (event) => {
    setSelectedCategory(event.target.value);

    setCurrentPage(1); // Reset to page 1 on category change
  };
  console.log(productInfo);
  const filteredProducts =
    productInfo &&
    productInfo.filter((product) => {
      const matchesSearchTerm = product.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "" || product.category === selectedCategory;
      return matchesSearchTerm && matchesCategory;
    });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts =
    filteredProducts &&
    filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts?.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    (async function () {
      const response = await fetch(`${proxy}/product/getProduct`);

      if (response.status === 200) {
        setProduct((await response.json()).products);
      }
    })();
    (async function () {
      const response = await fetch(`${proxy}/product/getCategory`);
      if (response.status === 200) {
        setCategory(
          await response.json().then((resp) => {
            return resp.categorys.map((el) => el.name);
          })
        );
      }
    })();
  }, []);

  return (
    <div className={style.container}>
      <div className={style.search_bar}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          aria-label="Search products"
        />
        <button
          className={style.search_button}
          onClick={() => setSearchTerm("")}
        >
          Search
        </button>
        <button
          className={style.login_button}
          onClick={() => {
            navigate("/login");
          }}
        >
          {" "}
          Login
        </button>
      </div>
      <div className="category-filter">
        <label htmlFor="category-select">Filter by Category</label>{" "}
        <select
          id="category-select"
          value={selectedCategory}
          onChange={handleCategoryChange}
          aria-label="Filter by category"
        >
          <option value="">All Categories</option>
          {categories &&
            categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
        </select>
      </div>
      <Products productsInfo={currentProducts} />
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
      />
    </div>
  );
}

function Products({ productsInfo }) {
  return (
    <div className={style.products_grid}>
      {productsInfo &&
        productsInfo.map((product, index) => (
          <div key={index} className={style.product_card}>
            <img
              className={style.product_image}
              src={product.images}
              height={50}
              width={100}
              alt={product.title}
            />
            <div className={style.product_title}>{product.productName}</div>
            <div className={style.product_price}>{product.price} &#x20B9;</div>
          </div>
        ))}
    </div>
  );
}

function Pagination({ totalPages, currentPage, handlePageChange }) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className={style.pagination}>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={currentPage === page ? style.active_page : ""}
        >
          {page}
        </button>
      ))}
    </div>
  );
}

export default Dashboard;
