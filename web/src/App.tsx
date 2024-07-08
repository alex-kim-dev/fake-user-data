import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { Shuffle, ExclamationTriangleFill } from 'react-bootstrap-icons';
import { CanceledError } from 'axios';
import { debounce, random } from 'underscore';
import { InView } from 'react-intersection-observer';

import type { User, Query } from '@fake-user-data/shared';
import {
  Locale,
  ERRORS,
  SEED,
  PAGE,
  querySchema,
  querySchemaWithDefaults,
} from '@fake-user-data/shared';

import { formatter } from '~/utils.ts';
import { UsersTable } from '~/components/UsersTable';
import { api } from '~/api';
import { ExportButton } from '~/components/ExportButton.tsx';

const SEED_INPUT_STEP = 1;
const ERR_RANGE_MIN = ERRORS.MIN;
const ERR_RANGE_MAX = 10;
const ERR_RANGE_STEP = 0.25;
const ERR_INPUT_STEP = 1;
const DEBOUNCE_DELAY = 1000;

const initializeState = (): Query => {
  const params = new URL(window.location.href).searchParams;
  return querySchemaWithDefaults.parse(Object.fromEntries(params.entries()));
};

const setSearchParams = (query: Query) => {
  const url = new URL(window.location.href);
  const { locale, errors, seed } = formatter.query.toString(query);
  url.search = new URLSearchParams({ locale, errors, seed }).toString();
  window.history.replaceState(null, '', url);
};

export const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [query, setQuery] = useState(initializeState);
  const formatted = {
    locale: query.locale,
    errors: formatter.errors.format(query.errors),
    seed: formatter.seed.format(query.seed),
  };

  const getUsers = (query: Query, resetPage = true) => {
    setLoading(true);
    setError(null);

    api
      .getFakeUsers(query)
      .then(({ data }) => {
        setUsers((prevUsers) =>
          resetPage ? data.users : [...prevUsers, ...data.users],
        );
        if (resetPage) setSearchParams(data.query);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (!(err instanceof Error) || err instanceof CanceledError) return;
        setError(err);
        setLoading(false);
      });
  };

  const getUsersWithDebounce = useMemo(
    () => debounce(getUsers, DEBOUNCE_DELAY, false),
    [],
  );

  useLayoutEffect(() => {
    const isDarkModePreffered = window.matchMedia(
      '(prefers-color-scheme: dark)',
    ).matches;

    document.documentElement.setAttribute(
      'data-bs-theme',
      isDarkModePreffered ? 'dark' : 'light',
    );
  }, []);

  useEffect(() => {
    getUsers(query);

    return () => {
      api.controllers.getFakeUsers?.abort();
      getUsersWithDebounce.cancel();
    };
  }, []);

  const handleLocaleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newLocale = Locale[event.currentTarget.value as Locale];
    const newQuery = { ...query, locale: newLocale, page: PAGE.DEFAULT };
    setQuery(newQuery);
    getUsersWithDebounce(newQuery);
  };

  const handleErrorsChange: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget: { value },
  }) => {
    const { success, data } = querySchema.shape.errors.safeParse(value);
    if (!success && value !== '') return null;

    const newErrors = success ? data : 0;
    const newQuery = { ...query, errors: newErrors, page: PAGE.DEFAULT };

    setQuery(newQuery);
    getUsersWithDebounce(newQuery);
  };

  const handleSeedChange: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget: { value },
  }) => {
    const { success, data } = querySchema.shape.seed.safeParse(value);
    if (!success && value !== '') return null;

    const newSeed = success ? data : 0;
    const newQuery = { ...query, seed: newSeed, page: PAGE.DEFAULT };

    setQuery(newQuery);
    getUsersWithDebounce(newQuery);
  };

  const handleSeedShuffle: MouseEventHandler<HTMLButtonElement> = () => {
    const newQuery = {
      ...query,
      seed: random(SEED.MAX),
      page: PAGE.DEFAULT,
    };

    setQuery(newQuery);
    getUsersWithDebounce(newQuery);
  };

  const handleLoadMore = () => {
    getUsers({ ...query, page: query.page + 1 }, false);
    setQuery((prevQuery) => ({ ...prevQuery, page: prevQuery.page + 1 }));
  };

  return (
    <>
      <header className='navbar bg-primary-subtle mb-4'>
        <div className='container'>
          <div className='row flex-grow-1 gy-2'>
            <div className='col-12 col-md-6 col-lg-12 col-xl-2'>
              <div className='navbar-brand'>Fake user data</div>
            </div>

            <div className='col-12 col-sm-5 col-md-6 col-lg col-xl d-flex align-items-center gap-2'>
              <label className='col-form-label' htmlFor='region'>
                Region:
              </label>
              <select
                className='form-select'
                value={formatted.locale}
                onChange={handleLocaleChange}
                id='region'>
                <option value={Locale.en}>USA</option>
                <option value={Locale.es}>Spain</option>
                <option value={Locale.fr}>France</option>
              </select>
            </div>

            <div className='col-12 col-sm-7 col-md-6 col-lg-4 col-xl-auto d-flex align-items-center gap-2'>
              <label className='col-form-label' htmlFor='errors-range'>
                Errors:
              </label>
              <input
                className='form-range'
                id='errors-range'
                max={ERR_RANGE_MAX}
                min={ERR_RANGE_MIN}
                step={ERR_RANGE_STEP}
                type='range'
                value={formatted.errors}
                onChange={handleErrorsChange}
              />
              <label className='visually-hidden' htmlFor='errors'>
                Errors:
              </label>
              <input
                className='form-control errors flex-shrink-0'
                id='errors'
                max={ERRORS.MAX}
                min={ERRORS.MIN}
                step={ERR_INPUT_STEP}
                type='number'
                value={formatted.errors}
                onChange={handleErrorsChange}
              />
            </div>

            <div className='col col-sm-5 col-md-4 col-lg col-xl d-flex align-items-center gap-2'>
              <label className='col-form-label' htmlFor='seed'>
                Seed:
              </label>
              <div className='input-group flex-nowrap'>
                <input
                  className='form-control seed'
                  id='seed'
                  max={SEED.MAX}
                  min={SEED.MIN}
                  step={SEED_INPUT_STEP}
                  type='number'
                  value={formatted.seed}
                  onChange={handleSeedChange}
                />
                <button
                  aria-label='shuffle seed'
                  className='btn btn-outline-primary d-flex align-items-center'
                  type='button'
                  onClick={handleSeedShuffle}>
                  <Shuffle height={20} width={20} aria-hidden />
                </button>
              </div>
            </div>

            <div className='col-auto col-sm-7 col-md-2 col-lg-2 col-xl-auto d-flex justify-content-end'>
              <ExportButton query={query}>Export</ExportButton>
            </div>
          </div>
        </div>
      </header>
      <main className='container'>
        <div className='overflow-auto mb-3'>
          {users.length > 0 && (
            <>
              <UsersTable users={users} />
              <InView
                as='div'
                onChange={(inView) => {
                  inView && handleLoadMore();
                }}
              />
            </>
          )}
        </div>
        <div className='d-flex flex-column align-items-center'>
          {error && (
            <div
              className='alert alert-danger d-flex align-items-center gap-2'
              role='alert'>
              <ExclamationTriangleFill className='flex-shrink-0' />
              <div>Couldn't load users.</div>
              <button
                className='btn btn-primary'
                onClick={() => {
                  getUsers(query);
                }}>
                Retry
              </button>
            </div>
          )}
          {isLoading && (
            <div className='spinner-grow mb-3' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </div>
          )}
        </div>
      </main>
    </>
  );
};
