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
    const [touchStart, setTouchStart] = useState<number | null>(null);

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

    function handleTouchStart(
        event: React.TouchEvent<HTMLDivElement>
    ) {
        setTouchStart(event.touches[0].clientX);
    }

    function handleTouchEnd(
        event: React.TouchEvent<HTMLDivElement>
    ) {

        if (touchStart === null) {
            return;
        }

        const touchEnd = event.changedTouches[0].clientX;

        const distance = touchStart - touchEnd;

        // Swipe left
        if (distance > 50) {
            nextSlide();
        }

        // Swipe right
        if (distance < -50) {
            previousSlide();
        }

        setTouchStart(null);
    }

    return (
        <section className="px-3 pt-4 sm:px-6 sm:pt-6 md:px-16 md:pt-8">

            <div
                className="relative overflow-hidden rounded-3xl shadow-xl"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >

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
                            className="h-35 w-full shrink-0 object-cover sm:h-auto sm:aspect-4/1"
                        />

                    ))}

                </div>


                {/* Previous button */}
                <button
                    onClick={previousSlide}
                    className="absolute left-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center 
                    rounded-full bg-white/80 text-2xl text-text shadow hover:bg-white sm:flex"
                >
                    ‹
                </button>


                {/* Next button */}
                <button
                    onClick={nextSlide}
                    className="absolute right-4 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center 
                    rounded-full bg-white/80 text-2xl text-text shadow hover:bg-white sm:flex"
                >
                    ›
                </button>


                {/* Navigation dots */}
                <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5 sm:bottom-4 sm:gap-2">

                    {slides.map((_, index) => (

                        <button
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            aria-label={`Go to slide ${index + 1}`}
                            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 sm:h-2.5 sm:w-2.5 ${
                                currentSlide === index
                                    ? "w-4 bg-primary sm:w-6"
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