import axios from 'axios';

export const API_URL = 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

let currentToken: string | null = null;

export function setAuthToken(token: string | null) {
  currentToken = token;

  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    api.defaults.headers.common['Authorization'] = undefined;
  }
}

export function getAuthToken(): string | null {
  return currentToken;
}
