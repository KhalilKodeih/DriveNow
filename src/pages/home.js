// src/pages/home.js
import { Link } from "react-router-dom";
import { cars } from "../data/cars";
import CarCard from "../components/CarCard";

function Home() {
  const featuredCars = cars.slice(0, 3);

  return (
    <section className="home">
      <div className="home__hero">
        <div>
          <h1>Rent the perfect car in minutes</h1>
          <p>
            Affordable, reliable, and flexible car rentals for every journey.
          </p>
          <Link to="/cars" className="btn btn-primary">
            Browse Cars
          </Link>
        </div>
        <div className="home__hero-image">
          {/* Put hero image or illustration here via CSS background or img */}
        </div>
      </div>

      <div className="home__section">
        <h2>Featured Cars</h2>
        <div className="car-grid">
          {featuredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Home;
