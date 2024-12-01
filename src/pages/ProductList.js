import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/productList.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductList = ({ categoryId }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        console.log(categoryId)
        const response = await fetch(`http://localhost:1337/api/products/category/1`);
        if (!response.ok) {
          throw new Error(`Error fetching products: ${response.statusText}`);
        }
        const data = await response.json();
        setProducts(data);
        setTotalPages(Math.ceil(data.length / productsPerPage)); // Calculate total pages here
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]); // Re-fetch products when categoryId changes

  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
          <div className="sort-options">
            <button className="active">New</button>
            <button>Price ascending</button>
            <button>Price descending</button>
            <button>Rating</button>
          </div>
          <div className="product-grid">
            {currentProducts.map((product) => (
              <div key={product.id} className="product-card" onClick={() => handleProductClick(product.id)}>
                <img src={'https://reimg-teknosa-cloud-prod.mncdn.com/mnresize/200/200/productimage/125078807/125078807_0_MC/32b20c33.png'} alt={product.name} className="product-image" />
                <h3>{product.name}</h3>
                <p className="product-price">{product.price}</p>
                {product.discount && <span className="discount-tag">{product.discount}% OFF</span>}
                <button onClick={() => handleProductClick(product.id)}>View Details</button>
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
                className={currentPage === index + 1 ? 'active' : ''}
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
