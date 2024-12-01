import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../assets/styles/productList.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductList = () => {
  const navigate = useNavigate();
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("new"); // Default sort option

  // Category mapper
  const categoryMapper = [
    { category_id: 1, category_name: "MobilePhone" },
    { category_id: 2, category_name: "Television" },
    { category_id: 3, category_name: "Notebook" },
    { category_id: 4, category_name: "Tablet" },
  ];

  // Function to get category ID by name
  const getCategoryID = (categoryName) => {
    const category = categoryMapper.find(
      (cat) => cat.category_name === categoryName
    );
    return category ? category.category_id : null;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);

      const categoryId = getCategoryID(categoryName); // Get category ID from the mapper
      if (!categoryId) {
        setError("Invalid category name");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:1337/api/products/category/${categoryId}` // Use categoryId in API call
        );
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.statusText}`);
        }
        const data = await response.json();
        setProducts(data);
        setTotalPages(Math.ceil(data.length / productsPerPage)); // Calculate total pages
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]); // Re-fetch products when categoryName changes

  // Sorting logic
  const sortProducts = (products, option) => {
    switch (option) {
      case "price-asc":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...products].sort((a, b) => b.price - a.price);
      case "rating":
        return [...products].sort((a, b) => b.popularity - a.popularity); // Assuming popularity represents rating
      default:
        return products; // Default: no sorting
    }
  };

  const sortedProducts = sortProducts(products, sortOption); // Sort products based on selected option
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSortChange = (option) => {
    setSortOption(option);
    setCurrentPage(1); // Reset to the first page when sorting changes
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error + " Name: " + categoryName}</div>;
  }

  if (products.length === 0) {
    return <div>No products found in this category.</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="product-page">
        {/* Sidebar Filters */}
        <aside className="sidebar">
          <h3>Keywords</h3>
          <div className="tags">
            <button>Spring</button>
            <button>Smart</button>
            <button>Modern</button>
          </div>
        </aside>
        {/* Main Content - Product List */}
        <main className="product-list-container">
          <div className="product-info">
            <p>
              Showing {startIndex + 1}-{Math.min(startIndex + productsPerPage, products.length)} of {products.length} products in {categoryName}'s
            </p>
          </div>
          <div className="sort-options">
            <button
              className={sortOption === "new" ? "active" : ""}
              onClick={() => handleSortChange("new")}
            >
              New
            </button>
            <button
              className={sortOption === "price-asc" ? "active" : ""}
              onClick={() => handleSortChange("price-asc")}
            >
              Price ascending
            </button>
            <button
              className={sortOption === "price-desc" ? "active" : ""}
              onClick={() => handleSortChange("price-desc")}
            >
              Price descending
            </button>
            <button
              className={sortOption === "rating" ? "active" : ""}
              onClick={() => handleSortChange("rating")}
            >
              Popularity
            </button>
          </div>
          <div className="product-grid">
            {currentProducts.map((product) => (
              <div
                key={product.product_id}
                className="product-card"
                onClick={() => handleProductClick(product.product_id)}
              >
                <img
                  src={
                    product.photo_url || 'https://via.placeholder.com/150'
                  }
                  alt={product.name || 'Placeholder Image'}
                  className="product-image"
                />
                <h3>{product.name}</h3>
                <p className="product-price">{product.price + '₺'}</p>
                {product.discount && (
                  <span className="discount-tag">{product.discount}% OFF</span>
                )}
                <button onClick={() => handleProductClick(product.product_id)}>
                  View Details
                </button>
              </div>
            ))}
          </div>
          {/* Pagination Controls */}
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? "active" : ""}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ProductList;
