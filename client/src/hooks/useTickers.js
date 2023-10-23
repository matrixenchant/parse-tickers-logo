import { useContext } from 'react';
import { TickersContext } from '../context/TickersContext';

export const useTickers = () => useContext(TickersContext);
