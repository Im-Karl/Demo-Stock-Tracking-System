import React from 'react';
import { RiArrowRightSLine, RiHomeFill } from 'react-icons/ri';
import clsx from 'clsx';

export default function Breadcrumbs({ items, className }) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={clsx('flex text-sm text-grey-500', className)}>
      <ol className="flex flex-wrap items-center gap-y-1">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <RiArrowRightSLine className="mx-1.5 text-grey-400 dark:text-grey-600 shrink-0" size={16} />
              )}
              {isLast ? (
                <span className="font-semibold text-grey-900 dark:text-grey-100">{item.label}</span>
              ) : (
                <a
                  href={item.href}
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center gap-1.5"
                >
                  {index === 0 && <RiHomeFill />}
                  <span>{item.label}</span>
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
