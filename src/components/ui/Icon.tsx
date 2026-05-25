import { cn } from '@/lib/utils';

export type IconName =
  | 'actions'
  | 'arrow-down'
  | 'arrow-up'
  | 'budgets'
  | 'cancel'
  | 'chevron-left'
  | 'delete'
  | 'overview'
  | 'pots'
  | 'recurring-bills'
  | 'reset'
  | 'rollback'
  | 'transactions'
  | 'wallet';

interface IconProps {
  name: IconName;
  className?: string;
}

export default function Icon({ name, className }: IconProps) {
  const iconClasses = cn('h-5 w-5 shrink-0', className);

  return (
    <svg
      aria-hidden="true"
      className={iconClasses}
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      {name === 'overview' ? (
        <>
          <path
            d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6h-4v6H5a1 1 0 0 1-1-1v-9.5Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </>
      ) : null}

      {name === 'transactions' ? (
        <>
          <path
            d="M7 7h11m0 0-3-3m3 3-3 3M17 17H6m0 0 3 3m-3-3 3-3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </>
      ) : null}

      {name === 'budgets' ? (
        <>
          <path
            d="M12 4v8h8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M20 12a8 8 0 1 1-8-8"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </>
      ) : null}

      {name === 'pots' ? (
        <>
          <path
            d="M8 7h8m-7 0 1-3h4l1 3m-8 3h10l-1 10H8L7 10Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M10 13h4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </>
      ) : null}

      {name === 'recurring-bills' ? (
        <>
          <path
            d="M7 4h10a1 1 0 0 1 1 1v16l-3-2-3 2-3-2-3 2V5a1 1 0 0 1 1-1Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M9 9h6M9 13h6"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="1.8"
          />
        </>
      ) : null}

      {name === 'actions' ? (
        <path
          d="m13 3-7 11h5l-1 7 8-12h-5l1-6Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      ) : null}

      {name === 'delete' ? (
        <>
          <path
            d="M5 7h14M10 11v6m4-6v6M8 7l1-3h6l1 3m-9 0 1 13h8l1-13"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </>
      ) : null}

      {name === 'rollback' ? (
        <path
          d="M8 8H4V4m.7 9A7 7 0 1 0 6.1 6.1L4 8"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      ) : null}

      {name === 'cancel' ? (
        <path
          d="m7 7 10 10M17 7 7 17"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      ) : null}

      {name === 'reset' ? (
        <path
          d="M5 9a7 7 0 1 1 2 9.9M5 9V4m0 5h5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      ) : null}

      {name === 'arrow-up' ? (
        <path
          d="M12 19V5m0 0-5 5m5-5 5 5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      ) : null}

      {name === 'arrow-down' ? (
        <path
          d="M12 5v14m0 0-5-5m5 5 5-5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      ) : null}

      {name === 'wallet' ? (
        <>
          <path
            d="M5 7h13a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h11"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
          <path
            d="M16 12h4v3h-4a1.5 1.5 0 0 1 0-3Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.8"
          />
        </>
      ) : null}

      {name === 'chevron-left' ? (
        <path
          d="m15 6-6 6 6 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
      ) : null}
    </svg>
  );
}
