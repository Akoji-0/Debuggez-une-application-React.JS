import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState(null); // `null` signifie "toutes les catégories"
  const [currentPage, setCurrentPage] = useState(1);

  const changeType = (evtType) => {
    console.log("Changement de type :", evtType); // Vérifie la sélection du type
    setCurrentPage(1);
    setType(evtType);
  };

  // Filtrer les événements en fonction du type sélectionné
  const filteredEvents = (
    (!type
      ? data?.events // Si `type` est null, inclure tous les événements
      : data?.events.filter((event) => event.type === type)) || []
  ).filter(
    (_, index) =>
      (currentPage - 1) * PER_PAGE <= index && PER_PAGE * currentPage > index
  );

  const pageNumber = Math.ceil(
    ((!type
      ? data?.events
      : data?.events.filter((event) => event.type === type)
    )?.length || 0) / PER_PAGE
  );

  const typeList = Array.from(new Set(data?.events.map((event) => event.type)));

  return (
    <>
      {error && <div>An error occurred</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={typeList}
            onChange={(value) => changeType(value || null)}
          />
          <div id="events" className="ListContainer">
            {filteredEvents.map((event) => (
              <Modal key={event.id} Content={<ModalEvent event={event} />}>
                {({ setIsOpened }) => (
                  <EventCard
                    onClick={() => setIsOpened(true)}
                    imageSrc={event.cover}
                    title={event.title}
                    date={new Date(event.date)}
                    label={event.type}
                  />
                )}
              </Modal>
            ))}
          </div>
          <div className="Pagination">
            {[...Array(pageNumber)].map((_, n) => (
              <a
                key={`page-${n + 1}`}
                href="#events"
                onClick={() => setCurrentPage(n + 1)}
              >
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
