import React from 'react';
import { useTickers } from './hooks/useTickers';
import { Link } from 'react-router-dom'

const Home = () => {
  const { tickers, getLogosProgress, logos, stagesTickers } = useTickers();
  const { progress, all, part } = getLogosProgress(tickers);

  return (
    <div className="home">
      <div className="app-progress">
        <div className="app-progress-label">
          {progress.toFixed(1)}%{' '}
          <span>
            ({part} / {all})
          </span>
        </div>
        <div style={{ width: `${progress}%` }} className="app-progress-value"></div>
      </div>

      <div className="home-stages">
        {stagesTickers.map((stage, i) => (
          <Link to={`/stage-${i+1}`} key={i} className="home-stages__item">
            <div className="home-stages__item-preview">
              {stage.data.slice(0, 200).map(({ target }, j) =>
                logos[target.symbol] && logos[target.symbol] !== 'custom' ? (
                  <div
                    key={logos[target.symbol] + j + i}
                    className="home-stages__item-preview__item"
                    style={{ backgroundImage: `url(https://s3-symbol-logo.tradingview.com/${logos[target.symbol]}.svg)` }}></div>
                ) : null
              )}
            </div>
            <div className="home-stages__item-label">{`Stage ${i + 1}`}</div>
            <div className="home-stages__item-progress">
              <div className="home-stages__item-progress-value" style={{ width: `${stage.logosNum / stage.data.length * 100}%` }}></div>
              <div className="home-stages__item-progress-label">{stage.logosNum}/{stage.data.length}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
