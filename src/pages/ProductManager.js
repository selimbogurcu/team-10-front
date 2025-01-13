import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/productManager.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ProductManager = () => {
  const [activeTab, setActiveTab] = useState('categories');

  // --- Categories ---
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState({ id: null, name: '' });

  // --- Deliveries ---
  const [deliveryList, setDeliveryList] = useState([]);

  // --- Comments ---
  const [comments, setComments] = useState([]);

  // --- Stocks ---
  const [stocks, setStocks] = useState([]);
  const [newStock, setNewStock] = useState({ productId: '', quantity: '' });

  // --- Products (YENİ EKLİYORUZ) ---
  const [products, setProducts] = useState([]); 
  const [newProduct, setNewProduct] = useState({
    name: '',
    model: '',
    serial_number: '',
    description: '',
    quantity_in_stock: '',
    price: '',
    warranty_status: '',
    distributor_info: '',
    category_id: '',
    sizes: '',
    photo_url: '',
    popularity: 0
  });
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    if (activeTab === 'categories') fetchCategories();
    if (activeTab === 'deliveries') fetchDeliveryList();
    if (activeTab === 'comments') fetchUnapprovedComments();
    if (activeTab === 'stocks') fetchStocks();
    if (activeTab === 'products') fetchAllProducts();  // Yeni sekme için
  }, [activeTab]);

  // ================== CATEGORIES ======================
  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/product-manager/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  

  const handleAddCategory = async () => {
    try {
      await axios.post('http://localhost:1337/api/product-manager/category', {
        category_name: newCategory,
      });
      setNewCategory('');
      fetchCategories();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleUpdateCategory = async () => {
    try {
      await axios.put(`http://localhost:1337/api/product-manager/category/${editingCategory.id}`, {
        category_name: editingCategory.name,
      });
      setEditingCategory({ id: null, name: '' });
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:1337/api/product-manager/category/${id}`);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // ================== DELIVERIES ======================
  const fetchDeliveryList = async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/product-manager/delivery-list');
      setDeliveryList(response.data);
    } catch (error) {
      console.error('Error fetching delivery list:', error);
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setDeliveryList(prevList =>
        prevList.map(delivery =>
            delivery.order_id === orderId ? { ...delivery, delivery_status: newStatus } : delivery
        )
    );

    // Immediately update the status in the backend
    updateDeliveryStatus(orderId, newStatus);
};


  const updateDeliveryStatus = async (orderId, status) => {
    try {
        // Call the new endpoint
        await axios.put(`http://localhost:1337/api/order/${orderId}/status`, {
            status,
        });

        alert(`Delivery status updated for Order ID: ${orderId}`);
        
        // Refresh delivery list to reflect the changes
        fetchDeliveryList();
    } catch (error) {
        console.error('Error updating delivery status:', error);
        alert('Failed to update delivery status. Please try again.');
    }
};


  // ================== COMMENTS ======================
  const fetchUnapprovedComments = async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/comments/unapproved');
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching unapproved comments:', error);
    }
  };

  const handleApproveComment = async (id) => {
    try {
      await axios.post('http://localhost:1337/api/comments/approve', {
        comment_id: id,
      });
      fetchUnapprovedComments();
    } catch (error) {
      console.error('Error approving comment:', error);
    }
  };

  const handleDisapproveComment = async (id) => {
    try {
      await axios.delete(`http://localhost:1337/api/comments/${id}`);
      fetchUnapprovedComments();
    } catch (error) {
      console.error('Error disapproving comment:', error);
    }
  };

  // ================== STOCKS ======================
  const fetchStocks = async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/product-manager/stocks');
      setStocks(response.data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };

  const handleAddStock = async () => {
    try {
      await axios.post('http://localhost:1337/api/product-manager/stock', {
        productId: newStock.productId,
        quantity: newStock.quantity,
      });
      setNewStock({ productId: '', quantity: '' });
      fetchStocks();
    } catch (error) {
      console.error('Error adding stock:', error);
    }
  };

  // ================== PRODUCTS (YENİ) ======================
  const fetchAllProducts = async () => {
    try {
      const response = await axios.get('http://localhost:1337/api/product-manager/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleAddProduct = async () => {
    try {
      await axios.post('http://localhost:1337/api/product-manager/product', newProduct);
      // Başarılı ekleme sonrası formu sıfırla ve listeyi güncelle
      setNewProduct({
        name: '',
        model: '',
        serial_number: '',
        description: '',
        quantity_in_stock: '',
        price: '',
        warranty_status: '',
        distributor_info: '',
        category_id: '',
        sizes: '',
        photo_url: '',
        popularity: 0
      });
      fetchAllProducts();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.product_id);
    setNewProduct({ ...product }); 
  };

  const handleUpdateProduct = async () => {
    try {
      await axios.put(`http://localhost:1337/api/product-manager/product/${editingProduct}`, newProduct);
      setEditingProduct(null);
      // Formu sıfırla
      setNewProduct({
        name: '',
        model: '',
        serial_number: '',
        description: '',
        quantity_in_stock: '',
        price: '',
        warranty_status: '',
        distributor_info: '',
        category_id: '',
        sizes: '',
        photo_url: '',
        popularity: 0
      });
      fetchAllProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:1337/api/product-manager/product/${productId}`);
      fetchAllProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // ================== Sekmeye Göre Render ======================
  const renderContent = () => {
    switch (activeTab) {
      case 'categories':
        return (
          <div>
            <h2>Manage Categories</h2>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="New category name"
            />
            <button onClick={handleAddCategory}>Add</button>
            <ul>
              {categories.map((category) => (
                <li key={category.category_id}>
                  {editingCategory.id === category.category_id ? (
                    <>
                      <input
                        type="text"
                        value={editingCategory.name}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, name: e.target.value })
                        }
                        placeholder="Edit category name"
                      />
                      <button onClick={handleUpdateCategory}>Save</button>
                      <button onClick={() => setEditingCategory({ id: null, name: '' })}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {category.category_name}
                      <button
                        onClick={() =>
                          setEditingCategory({
                            id: category.category_id,
                            name: category.category_name,
                          })
                        }
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteCategory(category.category_id)}>
                        Delete
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      case 'deliveries':
        return (
          <div>
            <h2>Delivery List</h2>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer Name</th>
                  <th>Product Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {deliveryList.map((delivery) => (
                  <tr key={delivery.order_id}>
                    <td>{delivery.order_id}</td>
                    <td>{delivery.customer_name}</td>
                    <td>{delivery.product_name}</td>
                    <td>
                      <select
                        value={delivery.delivery_status}
                        onChange={(e) => handleStatusChange(delivery.order_id, e.target.value)}
                      >
                        <option value="processing">Processing</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                    <td>
                      <button onClick={() => updateDeliveryStatus(delivery.order_id, delivery.delivery_status)}>
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case 'comments':
        return (
          <div>
            <h2>Unapproved Comments</h2>
            <ul>
              {comments.map((comment) => (
                <li key={comment.comment_id}>
                  <p><strong>User:</strong> {comment.user_name}</p>
                  <p><strong>Product:</strong> {comment.product_name}</p>
                  <p>{comment.content}</p>
                  <button onClick={() => handleApproveComment(comment.comment_id)}>Approve</button>
                  <button onClick={() => handleDisapproveComment(comment.comment_id)}>Disapprove</button>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'stocks':
        return (
          <div>
            <h2>Manage Stocks</h2>
            <input
              type="text"
              value={newStock.productId}
              onChange={(e) => setNewStock({ ...newStock, productId: e.target.value })}
              placeholder="Product ID"
            />
            <input
              type="number"
              value={newStock.quantity}
              onChange={(e) => setNewStock({ ...newStock, quantity: e.target.value })}
              placeholder="Quantity"
            />
            <button onClick={handleAddStock}>Add Stock</button>
            <ul>
              {stocks.map((stock) => (
                <li key={stock.product_id}>
                  <strong>Product ID:</strong> {stock.product_id}, <strong>Quantity:</strong> {stock.quantity}
                </li>
              ))}
            </ul>
          </div>
        );
      // ------------------ YENİ PRODUCTS SEKMESİ -------------------
      case 'products':
        return (
          <div>
            <h2>Manage Products</h2>
            
            {/* Ürün ekleme/güncelleme formu */}
            <div>
              <input
                type="text"
                placeholder="Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="Model"
                value={newProduct.model}
                onChange={(e) => setNewProduct({ ...newProduct, model: e.target.value })}
              />
              <input
                type="text"
                placeholder="Serial Number"
                value={newProduct.serial_number}
                onChange={(e) => setNewProduct({ ...newProduct, serial_number: e.target.value })}
              />
              <textarea
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              <input
                type="number"
                placeholder="Quantity in Stock"
                value={newProduct.quantity_in_stock}
                onChange={(e) => setNewProduct({ ...newProduct, quantity_in_stock: e.target.value })}
              />
              <input
                type="number"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              />
              <input
                type="text"
                placeholder="Warranty Status"
                value={newProduct.warranty_status}
                onChange={(e) => setNewProduct({ ...newProduct, warranty_status: e.target.value })}
              />
              <input
                type="text"
                placeholder="Distributor Info"
                value={newProduct.distributor_info}
                onChange={(e) => setNewProduct({ ...newProduct, distributor_info: e.target.value })}
              />
              <input
                type="text"
                placeholder="Category ID"
                value={newProduct.category_id}
                onChange={(e) => setNewProduct({ ...newProduct, category_id: e.target.value })}
              />
              <input
                type="text"
                placeholder="Sizes"
                value={newProduct.sizes}
                onChange={(e) => setNewProduct({ ...newProduct, sizes: e.target.value })}
              />
              <input
                type="text"
                placeholder="Photo URL"
                value={newProduct.photo_url}
                onChange={(e) => setNewProduct({ ...newProduct, photo_url: e.target.value })}
              />
              <input
                type="number"
                placeholder="Popularity"
                value={newProduct.popularity}
                onChange={(e) => setNewProduct({ ...newProduct, popularity: e.target.value })}
              />

              {editingProduct ? (
                <button onClick={handleUpdateProduct}>Update Product</button>
              ) : (
                <button onClick={handleAddProduct}>Add Product</button>
              )}
            </div>

            {/* Ürün Listesi */}
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Model</th>
                  <th>Serial No</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((prod) => (
                  <tr key={prod.product_id}>
                    <td>{prod.product_id}</td>
                    <td>{prod.name}</td>
                    <td>{prod.model}</td>
                    <td>{prod.serial_number}</td>
                    <td>{prod.quantity_in_stock}</td>
                    <td>{prod.price}</td>
                    <td>
                      <button onClick={() => handleEditProduct(prod)}>Edit</button>
                      <button onClick={() => handleDeleteProduct(prod.product_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      // -----------------------------------------------------------
      default:
        return <div>Welcome! Please select an action.</div>;
    }
  };

  return (
    <div className="product-manager">
      <Navbar/>

      {/* ----- Yatay Panel ----- */}
      <div className="panel-horizontal">
        <div className="panel-title">TEAM10 Product Manager Panel</div>
        <ul>
          <li
            className={activeTab === 'categories' ? 'active' : ''}
            onClick={() => setActiveTab('categories')}
          >
            Categories
          </li>
          <li
            className={activeTab === 'deliveries' ? 'active' : ''}
            onClick={() => setActiveTab('deliveries')}
          >
            Deliveries
          </li>
          <li
            className={activeTab === 'comments' ? 'active' : ''}
            onClick={() => setActiveTab('comments')}
          >
            Comments
          </li>
          <li
            className={activeTab === 'stocks' ? 'active' : ''}
            onClick={() => setActiveTab('stocks')}
          >
            Stocks
          </li>
          <li
            className={activeTab === 'products' ? 'active' : ''}
            onClick={() => setActiveTab('products')}
          >
            Products
          </li>
        </ul>
      </div>

      {/* ----- İçerik (Main) ----- */}
      <div className="content">{renderContent()}</div>
    </div>
  );
};

export default ProductManager;
