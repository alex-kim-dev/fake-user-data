import { Query } from '@fake-user-data/shared';

export const formatter = {
  errors: new Intl.NumberFormat('en', {
    maximumFractionDigits: 2,
    roundingMode: 'trunc',
    useGrouping: false,
  }),

  seed: new Intl.NumberFormat('en', {
    maximumFractionDigits: 0,
    roundingMode: 'trunc',
    useGrouping: false,
  }),

  query: {
    toString: (query: Query) => ({
      locale: query.locale,
      errors: String(query.errors),
      seed: String(query.seed),
      page: String(query.page),
    }),
  },
};

export const download = (data: Blob | MediaSource, fileName: string) => {
  const href = URL.createObjectURL(data);
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};
