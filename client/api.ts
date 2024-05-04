import axiosLib from 'axios';

import type { ResponseBody, State } from '../shared/types';

const axios = axiosLib.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

export const api = {
  controllers: {} as Partial<Record<string, AbortController>>,

  getFakeUsers(state: Partial<State>) {
    const controller = new AbortController();
    api.controllers.getFakeUsers = controller;

    const queryString = new URLSearchParams({
      ...state,
      page: String(state.page),
    });
    const url = `/${queryString.size === 0 ? '' : '?'}${queryString}`;

    return axios.get<ResponseBody>(url, {
      signal: controller.signal,
    });
  },
};
