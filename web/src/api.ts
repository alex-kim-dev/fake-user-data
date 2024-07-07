import axiosLib from 'axios';

import type { ResponseBody, Query } from '@fake-user-data/shared';
import { formatter } from './utils';

const axios = axiosLib.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  timeout: 120_000,
});

export const api = {
  controllers: {} as Partial<Record<string, AbortController>>,

  getFakeUsers(query: Query) {
    const controller = new AbortController();
    api.controllers.getFakeUsers = controller;

    const queryString = new URLSearchParams(formatter.query.toString(query));
    const url = `/${queryString.size === 0 ? '' : '?'}${queryString}`;

    return axios.get<ResponseBody>(url, {
      signal: controller.signal,
    });
  },

  exportToCSV(query: Query) {
    const controller = new AbortController();
    api.controllers.exportCSV = controller;

    const queryString = new URLSearchParams(formatter.query.toString(query));
    const url = `/export${queryString.size === 0 ? '' : '?'}${queryString}`;

    return axios.get<Blob>(url, {
      signal: controller.signal,
      responseType: 'blob',
    });
  },
};
