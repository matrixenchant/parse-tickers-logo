import { useCallback, useState } from 'react';
import toast from 'react-hot-toast';

const API = 'http://192.168.50.61:5000'

export const useApi = (params = {}) => {
  const { initLoading } = {
    initLoading: params.initLoading || false,
  };

  const [loading, setLoading] = useState(initLoading);

  const fetcher = useCallback(async (url, props) => {
    props = props || {};
    props.method = props.method || 'GET';
    props.body = props.body || null;
    props.headers = props.headers || {};
    props.type = props.type || 'json';
    props.success = props.success || undefined;
    props.error = props.error || (() => {});

    let { method, body, headers, type, success, error } = props;
    setLoading(true);

    if (method === 'GET' && body) {
      method = 'POST';
    }

    if (body && type === 'json') {
      body = JSON.stringify(body);
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(`${API}${url}`, { method, body, headers });
      const data = await response.json();

      if (!response.ok) {
        error(data);
        return setLoading(false);
      }
      
      setLoading(false);
      if (success) return success(data);
      return data;
    } catch (e) {
      console.warn('useApi Error', e);
      toast.error(e.message);
      setLoading(false);
    }
  }, []);

  return [loading, fetcher];
};
