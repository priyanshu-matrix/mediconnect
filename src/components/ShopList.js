// ShopList.js
import React, { useState, useEffect, useRef } from "react";
import "./ShopList.css";

function ShopList() {
    const [medicineList, setMedicineList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        stockPrice: "",
        retailPrice: "",
        quantity: "",
    });
    const [editQuantity, setEditQuantity] = useState("");
    const [editIndex, setEditIndex] = useState(-1);

    const addModalRef = useRef(null);
    const editModalRef = useRef(null);

    // Fetch medicine list on component mount
    useEffect(() => {
        getMedicineList();
    }, []);

    async function getMedicineList() {
        const data = {
            request_type: "get_med",
            email: localStorage.getItem("email"),
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/medicine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok && result.status === true) {
                setMedicineList(result.medicine);
            } else {
                alert(`Failed to get data: ${result.message}`);
            }
        } catch (error) {
            alert(`Error fetching data: ${error.message}`);
        }
        setLoading(false);
    }

    // Handle form input changes
    function handleInputChange(e) {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    }

    // Function to add a new medicine
    async function addMedicine() {
        const generateRandomNumber = () =>
            Math.floor(10000 + Math.random() * 90000);
        const medData = {
            id: generateRandomNumber(),
            name: formData.name,
            brand: formData.brand,
            price: formData.stockPrice, // Stock Price
            retail_price: formData.retailPrice, // Retail Price
            quantity: formData.quantity,
            units_sold: 0,
        };

        const data = {
            request_type: "add_med",
            email: localStorage.getItem("email"),
            Med_data: medData,
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/medicine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok && result.status === true) {
                setMedicineList((prev) => [...prev, medData]);
                alert("Medicine added successfully");
            } else {
                alert(`Failed to add medicine: ${result.message}`);
            }
        } catch (error) {
            alert(`Error adding medicine: ${error.message}`);
        }
        // Reset form and hide modal
        setFormData({
            name: "",
            brand: "",
            stockPrice: "",
            retailPrice: "",
            quantity: "",
        });
        if (addModalRef.current) {
            const modal = window.bootstrap.Modal.getInstance(addModalRef.current);
            if (modal) {
                modal.hide();
            }
        }
    }

    // Function to delete a medicine
    async function deleteMedicine(id) {
        const data = {
            request_type: "delete_med",
            email: localStorage.getItem("email"),
            id: id,
        };

        try {
            const response = await fetch("http://127.0.0.1:8000/api/medicine", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (result.status === true) {
                setMedicineList((prev) => prev.filter((med) => med.id !== id));
                alert("Medicine deleted successfully");
            } else {
                alert(`Failed to delete medicine: ${result.message}`);
            }
        } catch (error) {
            alert(`Error deleting medicine: ${error.message}`);
        }
    }

    // Open edit modal for a selected medicine
    function openEditModal(index) {
        setEditIndex(index);
        setEditQuantity(medicineList[index].quantity);
        if (editModalRef.current) {
            const modal = new window.bootstrap.Modal(editModalRef.current);
            modal.show();
        }
    }

    // Update the quantity for a medicine
    async function updateQuantity() {
        // Here you might also want to call an API to update the quantity.
        let updatedList = [...medicineList];
        updatedList[editIndex].quantity = editQuantity;
        setMedicineList(updatedList);
        alert("Quantity updated successfully");
        if (editModalRef.current) {
            const modal = window.bootstrap.Modal.getInstance(editModalRef.current);
            if (modal) {
                modal.hide();
            }
        }
    }

    return (
        <div style={{color: "black"}}>
            <div className="list-and-form">
                {/* Medicine List */}
                <div className="medicine-list-container">
                    <h2 className="medicine-list-heading text-center mb-4">
                        Medicine List
                    </h2>
                    
                    {loading ? (
                        <div className="loader" id="loader">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Brand</th>
                                        <th scope="col">Stock Price (₹)</th>
                                        <th scope="col">Retail Price</th>
                                        <th scope="col">Quantity</th>
                                        <th scope="col">Units Sold</th>
                                        <th scope="col">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {medicineList.map((medicine, index) => (
                                        <tr key={medicine.id}>
                                            <td>{index + 1}</td>
                                            <td>{medicine.name}</td>
                                            <td>{medicine.brand}</td>
                                            <td>{medicine.price}</td>
                                            <td>{medicine.retail_price}</td>
                                            <td>{medicine.quantity}</td>
                                            <td>{medicine.units_sold}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-outline-primary me-2"
                                                    onClick={() => openEditModal(index)}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => deleteMedicine(medicine.id)}
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Form Container */}
                <div className="form-container">
                    <h2 className="manage-medicine-heading text-center mb-4">
                        Manage Medicine Stock
                    </h2>
                    <div className="d-grid gap-2">
                        <button
                            type="button"
                            className="btn add-medicine-btn"
                            data-bs-toggle="modal"
                            data-bs-target="#addMedicineModal"
                        >
                            Add Medicine
                        </button>
                    </div>
                </div>
            </div>

            {/* Add Medicine Modal */}
            <div
                className="modal fade"
                id="addMedicineModal"
                tabIndex="-1"
                aria-labelledby="addMedicineModalLabel"
                aria-hidden="true"
                ref={addModalRef}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="addMedicineModalLabel">
                                Add Medicine
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <form id="medicineForm">
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="brand" className="form-label">
                                        Brand
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="stockPrice" className="form-label">
                                        Stock Price (₹)
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="stockPrice"
                                        value={formData.stockPrice}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="retailPrice" className="form-label">
                                        Retail Price
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="retailPrice"
                                        value={formData.retailPrice}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="quantity" className="form-label">
                                        Quantity
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="quantity"
                                        value={formData.quantity}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={addMedicine}
                                >
                                    Add Medicine
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Quantity Modal */}
            <div
                className="modal fade"
                id="editQuantityModal"
                tabIndex="-1"
                aria-labelledby="editQuantityModalLabel"
                aria-hidden="true"
                ref={editModalRef}
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editQuantityModalLabel">
                                Edit Quantity
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="edit-quantity" className="form-label">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="edit-quantity"
                                    value={editQuantity}
                                    onChange={(e) => setEditQuantity(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={updateQuantity}
                            >
                                Update Quantity
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShopList;
