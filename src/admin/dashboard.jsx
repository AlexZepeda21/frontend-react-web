import React from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement
);

const Dashboard = () => {
  // Datos para la gráfica de barras
  const barData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      {
        label: "Ventas 2024",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Los 6 platos mas reservados"},
    },
  };

  // Datos para la gráfica de línea
  const lineData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
      {
        label: "Ganancias 2024",
        data: [40, 55, 70, 80, 90, 100],
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.4,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Ganancias Mensuales (2024)" },
    },
  };

  return (
    <div className="container di mt-5">
        <div className="dashboard-container" style={styles.dashboardContainer}>
      <div className="chart" style={styles.chart}>
        <h3 style={styles.title}>Gráfica de Barras</h3>
        <Bar data={barData} options={barOptions} />
      </div>
      <div className="chart" style={styles.chart}>
        <h3 style={styles.title}>Gráfica de Líneas</h3>
        <Line data={lineData} options={lineOptions} />
      </div>
    </div>
    </div>

    
  );
};

// Estilos CSS en JS
const styles = {
  dashboardContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // Dos columnas iguales
    gap: "20px",
    padding: "20px",
    maxWidth: "1200px", // Ancho máximo del contenedor
    margin: "auto", // Centrar el contenedor
  },
  chart: {
    backgroundColor: "#ffffff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    height: "300px", // Altura específica para cada gráfica
  },
  title: {
    textAlign: "center",
    marginBottom: "15px",
  },
};

export default Dashboard;
