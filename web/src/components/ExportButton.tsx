import { type ReactNode, type MouseEventHandler, useState } from 'react';
import { CanceledError } from 'axios';
import cn from 'clsx';

import type { Query } from '@fake-user-data/shared';
import { api } from '~/api';
import { download } from '~/utils';

interface ExportButtonProps {
  query: Query;
  children?: ReactNode;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  query,
  children,
}) => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleExport: MouseEventHandler<HTMLButtonElement> = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await api.exportToCSV(query);
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
      className={cn('btn d-flex align-items-center position-relative', {
        'btn-outline-primary': !error,
        'btn-outline-danger': error,
      })}
      onClick={handleExport}>
      {isLoading && (
        <span className='position-absolute top-50 start-50 translate-middle'>
          <span aria-hidden='true' className='spinner-grow spinner-grow-sm' />
        </span>
      )}
      <span className={cn({ 'opacity-0': isLoading })}>
        {error ? 'Retry' : children || 'Export'}
      </span>
    </button>
  );
};
