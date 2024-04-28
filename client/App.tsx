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

import { Query, User } from '../shared/types';
import {
  DEFAULT_ERRORS,
  DEFAULT_LOCALE,
  Locale,
  MAX_ERRORS,
  MAX_SEED,
  MIN_ERRORS,
  MIN_SEED,
} from '../shared/constants';

import { UsersTable } from './components/UsersTable';
import { api } from './api';

const MAX_ERRORS_RANGE = 10;
const STEP_ERRORS_RANGE = 0.25;
const STEP_ERRORS = 1;
const STEP_SEED = 1;
const DEBOUNCE_DELAY = 1000;

const errorsFormatter = new Intl.NumberFormat('en', {
  maximumFractionDigits: 2,
  roundingMode: 'trunc',
  useGrouping: false,
} as Intl.NumberFormatOptions);

const seedFormatter = new Intl.NumberFormat('en', {
  maximumFractionDigits: 0,
  roundingMode: 'trunc',
  useGrouping: false,
} as Intl.NumberFormatOptions);

export const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE);
  const [errors, setErrors] = useState(String(DEFAULT_ERRORS));
  const [seed, setSeed] = useState(String(random(MAX_SEED)));

  const requestFakeUsers = async (query: Query) => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.getFakeUsers(query);
      setUsers(data.users);
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
    requestFakeUsers({ locale, errors, seed });

    return () => {
      api.controllers.getFakeUsers?.abort();
      debouncedRequest.cancel();
    };
  }, []);

  const handleRegionChange: ChangeEventHandler<HTMLSelectElement> = (event) => {
    const newLocale = Locale[event.currentTarget.value as Locale];
    setLocale(newLocale);
    debouncedRequest({ locale: newLocale, errors, seed });
  };

  const handleErrorsChange: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget: { value },
  }) => {
    const parsed = parseFloat(value) || MIN_ERRORS;
    if (parsed < MIN_ERRORS || parsed > MAX_ERRORS) return;
    const newErrors = errorsFormatter.format(parsed);

    setErrors(newErrors);
    debouncedRequest({ locale, errors: newErrors, seed });
  };

  const handleSeedChange: ChangeEventHandler<HTMLInputElement> = ({
    currentTarget: { value },
  }) => {
    const parsed = parseInt(value, 10) || MIN_SEED;
    if (parsed < MIN_SEED || parsed > MAX_SEED) return;
    const newSeed = seedFormatter.format(parsed);

    setSeed(newSeed);
    debouncedRequest({ locale, errors, seed: newSeed });
  };

  const handleShuffleSeed: MouseEventHandler<HTMLButtonElement> = () => {
    const newSeed = String(random(MAX_SEED));
    setSeed(newSeed);
    debouncedRequest({ locale, errors, seed: newSeed });
  };

  return (
    <>
      <header className='navbar bg-light mb-4'>
        <div className='container'>
          <div className='row gy-2'>
            <div className='col-12 col-md-6 col-lg-12 col-xl-auto'>
              <div className='navbar-brand'>Fake user data</div>
            </div>

            <div className='col-12 col-sm-5 col-md-6 col-lg col-xl d-flex align-items-center gap-2'>
              <label className='col-form-label' htmlFor='region'>
                Region:
              </label>
              <select
                className='form-select'
                value={locale}
                onChange={handleRegionChange}
                id='region'>
                <option value={Locale.en}>USA</option>
                <option value={Locale.es}>Spain</option>
                <option value={Locale.fr}>France</option>
              </select>
            </div>

            <div className='col-12 col-sm-7 col-md-6 col-lg-4 col-xl-4 d-flex align-items-center gap-2'>
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
                value={errors}
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
                value={errors}
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
                  value={seed}
                  onChange={handleSeedChange}
                />
                <button
                  aria-label='shuffle seed'
                  className='btn btn-outline-secondary d-flex align-items-center'
                  type='button'
                  onClick={handleShuffleSeed}>
                  <Shuffle height={20} width={20} aria-hidden />
                </button>
              </div>
            </div>

            <div className='col-auto col-sm-7 col-md-2 col-lg-2 col-xl-1 d-flex justify-content-end'>
              <button
                className='btn btn-outline-primary ms-sm-auto'
                type='button'>
                Export
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className='container'>
        <div className='overflow-auto mb-3'>
          {users.length > 0 && <UsersTable users={users} />}
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
