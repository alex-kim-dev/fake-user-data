import { Shuffle } from 'react-bootstrap-icons';

export const App: React.FC = () => {
  return (
    <header className='navbar bg-light mb-4 mb-md-5'>
      <div className='container'>
        <div className='row gy-2'>
          <div className='col-12 col-md-6 col-lg-12 col-xl-auto'>
            <div className='navbar-brand'>Fake user data</div>
          </div>

          <div className='col-12 col-sm-5 col-md-6 col-lg col-xl d-flex align-items-center gap-2'>
            <label className='col-form-label' htmlFor='region'>
              Region:
            </label>
            <select className='form-select' id='region'>
              <option selected>Default region</option>
              <option value='USA'>USA</option>
              <option value='UK'>UK</option>
              <option value='Australia'>Australia</option>
            </select>
          </div>

          <div className='col-12 col-sm-7 col-md-6 col-lg-4 col-xl-4 d-flex align-items-center gap-2'>
            <label className='col-form-label' htmlFor='errors-range'>
              Errors:
            </label>
            <input
              className='form-range'
              id='errors-range'
              max={10}
              min={0}
              step={0.25}
              type='range'
            />
            <label className='visually-hidden' htmlFor='errors'>
              Errors:
            </label>
            <input
              className='form-control errors flex-shrink-0'
              id='errors'
              max={10000}
              min={0}
              step={1}
              type='number'
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
                max={9999999}
                min={0}
                step={1}
                type='number'
              />
              <button
                aria-label='shuffle seed'
                className='btn btn-outline-secondary d-flex align-items-center'
                type='button'>
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
  );
};
