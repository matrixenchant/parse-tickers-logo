import { createContext, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useApi, useGetApi } from '../hooks';

export const TickersContext = createContext({
  tickers: [],
  stagesTickers: [],
  logos: {},
  getLogosProgress: (data) => {},
  updateLogo: (symbol, logo) => {},
  stagesNum: 0,
});

export const TickersProvider = ({ children }) => {
  const [loadingTickers, tickers] = useGetApi('/', []);

  const [loadingApi, api] = useApi();
  const [loadingLogos, logos, mutate] = useGetApi('/logos', {});
  const stagesNum = 10;

  const updateLogo = (symbol, logo) => {
    api('/save', {
      method: 'POST',
      body: {
        symbol,
        logo,
      },
      success: () => {
        mutate({ ...logos, [symbol]: logo });
      },
      error: (e) => {
        console.log(e);
        toast.error(e.message);
      },
    });
  };

  const stagesTickers = useMemo(() => {
    let splitted = splitArray(tickers, Math.ceil(tickers.length / stagesNum));
    splitted = splitted.map((stage) => {
      return {
        data: stage,
        logosNum: stage.reduce((res, { target }) => +!!logos[target.symbol] + res, 0),
      };
    });
    return splitted;
  }, [tickers, logos]);

  const getLogosProgress = useCallback(
    (data) => {
      const progress = data.length ? (Object.keys(logos).length / data.length) * 100 : 0;
      return {
        progress,
        all: data.length,
        part: Object.keys(logos).length,
      };
    },
    [logos]
  );

  return (
    <TickersContext.Provider
      value={{
        logos,
        tickers,
        stagesTickers,

        updateLogo,
        getLogosProgress,
        stagesNum,
      }}>
      {loadingTickers ? <Loader /> : children}
    </TickersContext.Provider>
  );
};

const Loader = () => (
  <div className="loader">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="200px"
      height="200px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid">
      <rect x="17.5" y="30" width="15" height="40" fill="#0051a2">
        <animate
          attributeName="y"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="18;30;30"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-0.2s"></animate>
        <animate
          attributeName="height"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="64;40;40"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-0.2s"></animate>
      </rect>
      <rect x="42.5" y="30" width="15" height="40" fill="#1b75be">
        <animate
          attributeName="y"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="20.999999999999996;30;30"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-0.1s"></animate>
        <animate
          attributeName="height"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="58.00000000000001;40;40"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
          begin="-0.1s"></animate>
      </rect>
      <rect x="67.5" y="30" width="15" height="40" fill="#408ee0">
        <animate
          attributeName="y"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="20.999999999999996;30;30"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"></animate>
        <animate
          attributeName="height"
          repeatCount="indefinite"
          dur="1s"
          calcMode="spline"
          keyTimes="0;0.5;1"
          values="58.00000000000001;40;40"
          keySplines="0 0.5 0.5 1;0 0.5 0.5 1"></animate>
      </rect>
    </svg>
  </div>
);

function splitArray(array, chunkSize) {
  return array.reduce((result, item, index) => {
    if (index % chunkSize === 0) {
      result.push([]);
    }
    result[result.length - 1].push(item);
    return result;
  }, []);
}
