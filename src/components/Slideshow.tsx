import { useEffect, useState } from "react";

import slide1 from "../assets/slide1.jpg";
import slide2 from "../assets/slide2.jpg";
import slide3 from "../assets/slide3.jpg";

const slides = [
    slide1,
    slide2,
    slide3
];

function Slideshow() {

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {

        const interval = setInterval(() => {

            setCurrentSlide((current) =>
                current === slides.length - 1
                    ? 0
                    : current + 1
            );

        }, 3000);

        return () => clearInterval(interval);

    }, []);

    function previousSlide() {

        setCurrentSlide((current) =>
            current === 0
                ? slides.length - 1
                : current - 1
        );
    }

    function nextSlide() {

        setCurrentSlide((current) =>
            current === slides.length - 1
                ? 0
                : current + 1
        );
    }

    return (
        <section className="px-4 pt-8 md:px-16">

            <div className="relative overflow-hidden rounded-3xl shadow-xl">

                {/* Sliding image strip */}
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{
                        transform: `translateX(-${currentSlide * 100}%)`
                    }}
                >

                    {slides.map((slide, index) => (

                        <img
                            key={index}
                            src={slide}
                            alt={`Foring promotion ${index + 1}`}
                            className="h-20 w-full shrink-0 object-cover sm:h-64 md:h-80"
                        />

                    ))}

                </div>


                {/* Previous button */}
                <button
                    onClick={previousSlide}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-4 py-2 text-2xl text-text shadow hover:bg-white"
                    aria-label="Previous slide"
                >
                    ‹
                </button>


                {/* Next button */}
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-4 py-2 text-2xl text-text shadow hover:bg-white"
                    aria-label="Next slide"
                >
                    ›
                </button>


                {/* Navigation dots */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">

                    {slides.map((_, index) => (

                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                                currentSlide === index
                                    ? "w-6 bg-primary"
                                    : "bg-white/70"
                            }`}
                        />

                    ))}

                </div>

            </div>

        </section>
    );
}

export default Slideshow;