import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/styles/productManager.css';

const ProductManager = () => {
    const [activeTab, setActiveTab] = useState('categories');
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [editCategory, setEditCategory] = useState({ id: null, name: '' });
    const [deliveryList, setDeliveryList] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        if (activeTab === 'categories') fetchCategories();
        if (activeTab === 'deliveries') fetchDeliveryList();
        if (activeTab === 'comments') fetchComments();
    }, [activeTab]);

    // Kategorileri getirme
    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:1337/api/product-manager/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Yeni kategori ekleme
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

    // Kategori düzenleme
    const handleUpdateCategory = async () => {
        try {
            await axios.put(`http://localhost:1337/api/product-manager/category/${editCategory.id}`, {
                category_name: editCategory.name,
            });
            setEditCategory({ id: null, name: '' });
            fetchCategories();
        } catch (error) {
            console.error('Error updating category:', error);
        }
    };

    // Kategori silme
    const handleDeleteCategory = async (id) => {
        try {
            await axios.delete(`http://localhost:1337/api/product-manager/category/${id}`);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    // Teslimat listesini getirme
    const fetchDeliveryList = async () => {
        try {
            const response = await axios.post('http://localhost:1337/api/product-manager/delivery-list');
            setDeliveryList(response.data);
        } catch (error) {
            console.error('Error fetching delivery list:', error);
        }
    };

    // Yorumları getirme
    const fetchComments = async () => {
        try {
            const response = await axios.get('http://localhost:1337/api/product-manager/comments');
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    // Yorumu onaylama
    const handleApproveComment = async (id) => {
        try {
            await axios.post('http://localhost:1337/api/product-manager/comment/approve', {
                commentId: id,
            });
            fetchComments();
        } catch (error) {
            console.error('Error approving comment:', error);
        }
    };

    // Dinamik içerik alanı
    const renderContent = () => {
        switch (activeTab) {
            case 'categories':
                return (
                    <div>
                        <h2>Kategorileri Yönet</h2>
                        <input
                            type="text"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Yeni kategori adı"
                        />
                        <button onClick={handleAddCategory}>Ekle</button>
                        <ul>
                            {categories.map((category) => (
                                <li key={category.category_id}>
                                    {category.category_name}
                                    <button
                                        onClick={() =>
                                            setEditCategory({ id: category.category_id, name: category.category_name })
                                        }
                                    >
                                        Düzenle
                                    </button>
                                    <button onClick={() => handleDeleteCategory(category.category_id)}>Sil</button>
                                </li>
                            ))}
                        </ul>
                        {editCategory.id && (
                            <div>
                                <input
                                    type="text"
                                    value={editCategory.name}
                                    onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                                    placeholder="Kategori adı düzenle"
                                />
                                <button onClick={handleUpdateCategory}>Güncelle</button>
                            </div>
                        )}
                    </div>
                );

            case 'deliveries':
                return (
                    <div>
                        <h2>Teslimat Listesi</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Sipariş ID</th>
                                    <th>Müşteri Adı</th>
                                    <th>Ürün Adı</th>
                                    <th>Durum</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveryList.map((delivery) => (
                                    <tr key={delivery.order_id}>
                                        <td>{delivery.order_id}</td>
                                        <td>{delivery.customer_name}</td>
                                        <td>{delivery.product_name}</td>
                                        <td>{delivery.delivery_status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case 'comments':
                return (
                    <div>
                        <h2>Yorumları Yönet</h2>
                        <ul>
                            {comments.map((comment) => (
                                <li key={comment.comment_id}>
                                    {comment.content}
                                    <button onClick={() => handleApproveComment(comment.comment_id)}>Onayla</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                );

            default:
                return <div>Hoş geldiniz! Lütfen bir işlem seçin.</div>;
        }
    };

    return (
        <div className="product-manager">
            <aside className="sidebar">
                <h1>Product Manager</h1>
                <ul>
                    <li onClick={() => setActiveTab('categories')}>Kategoriler</li>
                    <li onClick={() => setActiveTab('deliveries')}>Teslimatlar</li>
                    <li onClick={() => setActiveTab('comments')}>Yorumlar</li>
                </ul>
            </aside>
            <main className="content">{renderContent()}</main>
        </div>
    );
};

export default ProductManager;
