import React from "react";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const ProductoCardChef = () => {
    const navigate = useNavigate();

    return (
        <div className="d-flex justify-content-center align-items-center">
            <div
                className="d-flex flex-row justify-content-center align-items-center gap-3"
                style={{ marginTop: 200 }}
            >
                <Card
                    style={{ width: "25rem", overflow: "hidden", cursor: "pointer" }}
                    onClick={() => navigate("../admin/categoria_productos")}
                >
                    <Card.Body>
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                height: "200px",
                            }}
                        >
                            <img
                                src="https://encolombia.com/wp-content/uploads/2021/12/Que-son-las-Verduras.jpg"
                                alt="Imagen de la categoria de producto"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                        </div>
                        <Card.Title
                            style={{
                                color: "black",
                                textAlign: "center",
                                marginTop: "10px",
                            }}
                        >
                            Categorías de productos
                        </Card.Title>
                    </Card.Body>
                </Card>

                <Card
                    style={{ width: "25rem", overflow: "hidden", cursor: "pointer" }}
                    onClick={() => navigate("../admin/productos")}
                >
                    <Card.Body>
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                height: "200px",
                            }}
                        >
                            <img
                                src="https://encolombia.com/wp-content/uploads/2021/12/Que-son-las-Verduras.jpg"
                                alt="Imagen de la categoria de producto"
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                        </div>
                        <Card.Title
                            style={{
                                color: "black",
                                textAlign: "center",
                                marginTop: "10px",
                            }}
                        >
                            Productos
                        </Card.Title>
                    </Card.Body>
                </Card>
            </div>
        </div>
    );
};

export default ProductoCardChef;
