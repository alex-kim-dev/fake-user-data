import axiosLib from 'axios';

import { ResponseBody } from '../server/types';

const axios = axiosLib.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
});

export const api = {
  controllers: {} as Partial<Record<string, AbortController>>,

  getFakeUsers() {
    const controller = new AbortController();
    api.controllers.getFakeUsers = controller;

    return axios.get<ResponseBody>('/', {
      signal: controller.signal,
    });
  },
};
