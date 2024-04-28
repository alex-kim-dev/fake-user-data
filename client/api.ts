import axiosLib from 'axios';

import { Query, ResponseBody } from '../shared/types';

const axios = axiosLib.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

export const api = {
  controllers: {} as Partial<Record<string, AbortController>>,

  getFakeUsers(query: Partial<Query>) {
    const controller = new AbortController();
    api.controllers.getFakeUsers = controller;

    const queryString = new URLSearchParams({ ...query });
    const url = `/${queryString.size === 0 ? '' : '?'}${queryString}`;

    return axios.get<ResponseBody>(url, {
      signal: controller.signal,
    });
  },
};
