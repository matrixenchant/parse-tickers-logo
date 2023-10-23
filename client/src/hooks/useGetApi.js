import useSWR, { useSWRConfig } from 'swr';
import { useApi } from './useApi';

const useGetApi = (key, init = undefined, props = {}) => {
  const [loading, api] = useApi();

  const { data, mutate } = useSWR(key, (url) => api(url, props), {
    revalidateOnFocus: 0,
  });
  
  if (data === undefined) return [true, init, mutate];
  return [false, data, mutate];
};

export default useGetApi;
