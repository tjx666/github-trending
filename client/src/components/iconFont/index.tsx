import clsx from 'clsx';
import './style.css';
import { useEffect } from 'react';

interface Props {
  name: string;
  className?: string;
}

export default function IconFont(props: Props) {
  useEffect(() => {
    // @ts-expect-error
    import('./symbol');
  }, []);

  return (
    <svg className={clsx('icon', props.className)} aria-hidden="true">
      <use xlinkHref={`#icon-${props.name}`}></use>
    </svg>
  );
}
