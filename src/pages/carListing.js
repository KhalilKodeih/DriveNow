// src/pages/carListing.js
import { useState } from "react";
import { cars as allCars } from "../data/cars";
import CarCard from "../components/CarCard";

function Cars() {
  const [filter, setFilter] = useState("All");

  const filteredCars =
    filter === "All" ? allCars : allCars.filter((car) => car.type === filter);

  return (
    <section className="page">
      <h1>Available Cars</h1>

      <div className="filters">
        <label>Filter by type: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Economy</option>
          <option>Luxury</option>
          <option>SUV</option>
        </select>
      </div>

      <div className="car-grid">
        {filteredCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </section>
  );
}

export default Cars;
