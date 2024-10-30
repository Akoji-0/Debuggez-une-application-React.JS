import PropTypes from "prop-types";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch("/events.json");
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  // Creation d'un new tableau ordoné eventByDateDesc a partir de data.events, les events sont tries par date du + recent au + ancien
  const eventsByDateDesc =
    data && data.events
      ? [...data.events].sort((evtA, evtB) =>
          new Date(evtA.date) < new Date(evtB.date) ? 1 : -1
        )
      : [];

  // definition last pour recup les donnés de l'event le + recent ( tableau ordonne eventsByDateDesc ). si le tableau est vide, last est null, ce qui corrige le bug daffichage du footer ( dernier prest affiché)
  const last = eventsByDateDesc.length > 0 ? eventsByDateDesc[0] : null;
  const getData = useCallback(async () => {
    try {
      setData(await api.loadData());
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
  });

  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);

export default DataContext;