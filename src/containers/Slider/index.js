import { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  const sortedEvents = data?.focus?.sort((eventA, eventB) =>
    new Date(eventB.date) < new Date(eventA.date) ? -1 : 1
  ) || [];

  const goToNextCard = (newIndex = null) => {
    if (newIndex !== null) {
      setIndex(newIndex);
    } else {
      setIndex((prevIndex) =>
        prevIndex < sortedEvents.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  useEffect(() => {
    const interval = setInterval(goToNextCard, 5000);

    return () => clearInterval(interval);
  }, [index, sortedEvents]);

  const handleRadioChange = (newIndex) => {
    goToNextCard(newIndex);
  };

  return (
    <div className="SlideCardList">
      {sortedEvents.map((event, idx) => (
        <div
          key={event.id || `event-${idx}`}  
          className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
        >
          <img src={event.cover} alt={event.title} />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}

      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {sortedEvents.map((event, radioIdx) => (
            <input
              key={event.id || `pagination-${radioIdx}`} 
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => handleRadioChange(radioIdx)}
              aria-label={`Go to slide ${radioIdx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;