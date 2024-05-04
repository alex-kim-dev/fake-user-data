import { type ReactNode, type MouseEventHandler, useState } from 'react';
import { CanceledError } from 'axios';

import { State } from '../../shared/types';

import { api } from '~/api';
import { download } from '~/utils';

interface ExportButtonProps {
  state: State;
  children?: ReactNode;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  state,
  children,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleExport: MouseEventHandler<HTMLButtonElement> = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.exportToCSV(state);
      download(data, 'fake_users.csv');
      setLoading(false);
    } catch (err) {
      if (!(err instanceof Error) || err instanceof CanceledError) return;
      setError(err);
      setLoading(false);
    }
  };

  return (
    <button
      type='button'
      disabled={isLoading}
      className={`btn btn-outline-${error ? 'danger' : 'primary'} d-flex align-items-center`}
      onClick={handleExport}>
      {isLoading && (
        <span
          aria-hidden='true'
          className='spinner-grow spinner-grow-sm me-2'
        />
      )}
      {error ? 'Retry' : children || 'Export'}
    </button>
  );
};
