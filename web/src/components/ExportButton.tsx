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

  const handleExport: MouseEventHandler<HTMLButtonElement> = async () => {
    setLoading(true);

    try {
      const { data } = await api.exportToCSV(query);
      download(data, 'fake_users.csv');
      setLoading(false);
    } catch (err) {
      if (!(err instanceof Error) || err instanceof CanceledError) return;
      setLoading(false);
    }
  };

  return (
    <button
      type='button'
      disabled={isLoading}
      className='btn d-flex align-items-center position-relative btn-outline-primary'
      onClick={handleExport}>
      {isLoading && (
        <span className='position-absolute top-50 start-50 translate-middle'>
          <span aria-hidden='true' className='spinner-grow spinner-grow-sm' />
        </span>
      )}
      <span className={cn({ 'opacity-0': isLoading })}>
        {children || 'Export'}
      </span>
    </button>
  );
};
