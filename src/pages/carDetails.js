// src/pages/carDetails.js
import { useParams, Link } from "react-router-dom";
import { cars } from "../data/cars";
import BookingForm from "../components/BookingForm";

function CarDetails() {
  const { id } = useParams();
  const car = cars.find((c) => c.id === id);

  if (!car) {
    return (
      <section className="page">
        <h1>Car not found</h1>
        <Link to="/cars" className="btn">
          Back to cars
        </Link>
      </section>
    );
  }

  return (
    <section className="page car-details">
      <div className="car-details__info">
        <img src={car.image} alt={car.name} />
        <div>
          <h1>{car.name}</h1>
          <p>{car.description}</p>
          <ul>
            <li>Type: {car.type}</li>
            <li>Transmission: {car.transmission}</li>
            <li>Seats: {car.seats}</li>
            <li>Fuel: {car.fuel}</li>
            <li>Year: {car.year}</li>
          </ul>
          <p className="car-details__price">${car.pricePerDay} / day</p>
        </div>
      </div>

      <BookingForm carName={car.name} />
    </section>
  );
}

export default CarDetails;
