import {
  ChangeEventHandler,
  MouseEventHandler,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Shuffle } from 'react-bootstrap-icons';
import { CanceledError } from 'axios';
import { debounce, random } from 'underscore';
import { InView } from 'react-intersection-observer';

import type { Query, State, User } from '../shared/types';
import {
  DEFAULT_ERRORS,
  DEFAULT_LOCALE,
  DEFAULT_PAGE,
  Locale,
  MAX_ERRORS,
  MAX_SEED,
  MIN_ERRORS,
  MIN_SEED,
  MAX_ERRORS_RANGE,
  STEP_ERRORS_RANGE,
  STEP_ERRORS,
  STEP_SEED,
  DEBOUNCE_DELAY,
} from '../shared/constants';

import { parse } from './utils.ts';
import { UsersTable } from './components/UsersTable';
import { api } from './api';
import { ExportButton } from './components/ExportButton.tsx';

const initializeState = (): State => {
  const params = new URL(window.location.href).searchParams;
  return {
    locale: parse.locale(params.get('locale') ?? '') ?? DEFAULT_LOCALE,
    errors: parse.errors(params.get('errors') ?? '') ?? String(DEFAULT_ERRORS),
    seed: parse.seed(params.get('seed') ?? '') ?? String(random(MAX_SEED)),
    page: 0,
  };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setSearchParams = ({ page, ...rest }: Query) => {
  const url = new URL(window.location.href);
  url.search = new URLSearchParams(rest).toString();
  window.history.replaceState(null, '', url);
};

export const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [state, setState] = useState(initializeState);

  const requestFakeUsers = async (state: State, reload = true) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.getFakeUsers(state);
      setUsers((prevUsers) =>
        reload ? data.users : [...prevUsers, ...data.users],
      );
      if (reload) setSearchParams(data.query);
      setLoading(false);
    } catch (err) {
      if (!(err instanceof Error) || err instanceof CanceledError) return;
      setError(err);
      setLoading(false);
    }
  };

  const debouncedRequest = useMemo(
    () => debounce(requestFakeUsers, DEBOUNCE_DELAY, false),
    [],
  );

  useEffect(() => {
    requestFakeUsers(state);

    return () => {
      api.controllers.getFakeUsers?.abort();
      debouncedRequest.cancel();
    };
  }, []);

  const handleLocaleChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newLocale = Locale[event.currentTarget.value as Locale];
    const newState = { ...state, locale: newLocale, page: DEFAULT_PAGE };
    setState(newState);
    debouncedRequest(newState);
  };

  const handleErrorsChange: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget: { value },
  }) => {
    const newErrors = value === '' ? '0' : parse.errors(value);
    if (newErrors === null) return;
    const newState = { ...state, errors: newErrors, page: DEFAULT_PAGE };
    setState(newState);
    debouncedRequest(newState);
  };

  const handleSeedChange: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget: { value },
  }) => {
    const newSeed = value === '' ? '0' : parse.seed(value);
    if (newSeed === null) return;
    const newState = { ...state, seed: newSeed, page: DEFAULT_PAGE };
    setState(newState);
    debouncedRequest(newState);
  };

  const handleSeedShuffle: MouseEventHandler<HTMLButtonElement> = () => {
    const newState = {
      ...state,
      seed: String(random(MAX_SEED)),
      page: DEFAULT_PAGE,
    };
    setState(newState);
    debouncedRequest(newState);
  };

  const handleLoadMore = () => {
    requestFakeUsers({ ...state, page: state.page + 1 }, false);
    setState((prevState) => ({ ...prevState, page: prevState.page + 1 }));
  };

  return (
    <>
      <header className='navbar bg-light mb-4'>
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
                value={state.locale}
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
                max={MAX_ERRORS_RANGE}
                min={MIN_ERRORS}
                step={STEP_ERRORS_RANGE}
                type='range'
                value={state.errors}
                onChange={handleErrorsChange}
              />
              <label className='visually-hidden' htmlFor='errors'>
                Errors:
              </label>
              <input
                className='form-control errors flex-shrink-0'
                id='errors'
                max={MAX_ERRORS}
                min={MIN_ERRORS}
                step={STEP_ERRORS}
                type='number'
                value={state.errors}
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
                  max={MAX_SEED}
                  min={MIN_SEED}
                  step={STEP_SEED}
                  type='number'
                  value={state.seed}
                  onChange={handleSeedChange}
                />
                <button
                  aria-label='shuffle seed'
                  className='btn btn-outline-secondary d-flex align-items-center'
                  type='button'
                  onClick={handleSeedShuffle}>
                  <Shuffle height={20} width={20} aria-hidden />
                </button>
              </div>
            </div>

            <div className='col-auto col-sm-7 col-md-2 col-lg-2 col-xl-auto d-flex justify-content-end'>
              <ExportButton state={state}>Export</ExportButton>
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
                onChange={(inView) => inView && handleLoadMore()}
              />
            </>
          )}
        </div>
        <div className='d-flex flex-column align-items-center'>
          {error && (
            <div className='alert alert-danger' role='alert'>
              Couldn't load users, please try again.
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
