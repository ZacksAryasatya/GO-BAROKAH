import { API_URL } from './api';

export const buildImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${API_URL}/${path}`.replace(/([^:]\/)\/+/g, '$1');
};
