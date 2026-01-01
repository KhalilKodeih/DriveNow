// src/components/CarCard.js
import { Link } from "react-router-dom";

function CarCard({ car }) {
  return (
    <div className="car-card">
      <img src={car.image} alt={car.name} className="car-card__image" />
      <div className="car-card__body">
        <h3>{car.name}</h3>
        <p>
          {car.type} • {car.transmission} • {car.seats} seats
        </p>
        <p className="car-card__price">${car.pricePerDay}/day</p>
        <Link to={`/cars/${car.id}`} className="btn">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default CarCard;
