import React, { useState } from "react";

const Rating = ({ value, onChangeRating, disabled }) => {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(value || 0);

  const handelMouseEnter = (rating) => {
    if (!disabled) {
      setHoveredRating(rating);
    }
  };
  const handelMouseLeave = () => {
    if (!disabled) {
      setHoveredRating(0);
    }
  };
  const handelClick = (rating) => {
    if (!disabled) {
      setSelectedRating(rating);
      if (onChangeRating) {
        onChangeRating(rating);
      }
    }
  };

  //    generate stars
  const generateStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= (hoveredRating || selectedRating);
      stars.push(
        <span
          key={i}
          className={` text-gray-500 hover:text-yellow-500 text-[1.5rem] cursor-pointer transtition-colors transition-transform duration-300 hover:scale-[1.2] ease-in-out ${
            isFilled ? "text-yellow-500" : "text-gray-500"
          } `}
          onMouseEnter={handelMouseEnter}
          onMouseLeave={handelMouseLeave}
          onClick={() => handelClick(i)}
          style={{ pointerEvents: disabled ? "none" : "auto" }}
        >
          ★
        </span>
      );
    }
    return stars;
  };
  return (
    <div>
      <div className="rating">{generateStars()}</div>
    </div>
  );
};

export default Rating;
