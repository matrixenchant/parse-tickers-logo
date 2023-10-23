import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Virtuoso } from 'react-virtuoso';
import { useTickers } from './hooks/useTickers';

const Tickers = () => {
  const { stagesTickers, logos, updateLogo } = useTickers();
  const { stage: stageURL } = useParams();
  const stage = +stageURL.split('-')[1] - 1;

  const stageData = stagesTickers[stage];

  if (!stageData) return null;

  const progress = stageData.logosNum / stageData.data.length * 100;

  return (
    <div className="tickers">
      <div className="tickers-top">
        <h2 className="tickers-label">
          <Link to={-1}>{'<'}</Link>
          <span>Stage {stage + 1}</span>
        </h2>

        <div className="app-progress">
          <div className="app-progress-label">
            {progress.toFixed(1)}%{' '}
            <span>
              ({stageData.logosNum} / {stageData.data.length})
            </span>
          </div>
          <div style={{ width: `${progress}%` }} className="app-progress-value"></div>
        </div>
      </div>

      <Virtuoso
        className="tickers-wrap main-scroll"
        data={stageData.data}
        totalCount={stageData.data.length}
        itemContent={(i, { target, data }) => (
          <div key={i} className="ticker">
            <div className="ticker-target">
              <div className="ticker-target-name">{target.symbol}</div>
              <div className="ticker-target-info">{target.name}</div>
              <div
                className={`ticker-target-custom ticker-data__item ${
                  logos[target.symbol] === 'custom' ? 'choiced' : ''
                }`}
                onClick={() => updateLogo(target.symbol, 'custom')}>
                Custom Logo
              </div>
            </div>
            <div className="ticker-data main-scroll">
              {data.symbols
                .filter((x) => x.logoid)
                .slice(0, 20)
                .map(({ symbol, logoid, description }, j) => (
                  <div
                    key={symbol + i + j}
                    className={`ticker-data__item ${
                      logoid !== undefined && logos[target.symbol] === logoid ? 'choiced' : ''
                    } ${logoid === undefined ? 'disabled' : ''}`}
                    onClick={() => updateLogo(target.symbol, logoid)}>
                    <div className="ticker-data__item-name">
                      <p dangerouslySetInnerHTML={{ __html: symbol }} />
                    </div>
                    <div
                      className="ticker-data__item-info"
                      data-info={description.replace(/<(.|\n)*?>/g, '')}>
                      <p dangerouslySetInnerHTML={{ __html: description }} />
                    </div>

                    {logoid ? (
                      <div
                        className="ticker-data__item-logo"
                        style={{
                          backgroundImage: `url(https://s3-symbol-logo.tradingview.com/${logoid}.svg)`,
                        }}></div>
                    ) : (
                      <div className="ticker-data__item-logo empty">{target.symbol[0]}</div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      />
    </div>
  );
};

export default Tickers;
