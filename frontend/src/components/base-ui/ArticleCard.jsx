import React from 'react';
import GlassCard from './GlassCard';
import Avatar from './Avatar';

export default function ArticleCard({
  href,
  image,
  imageFallback,
  title,
  description,
  source,
  authorName,
  authorAvatar,
  authorFallback,
  authorHref,
  date,
  className = '',
}) {
  return (
    <GlassCard
      padding="none"
      className={`group flex flex-col h-full overflow-hidden transition-transform duration-300 hover:-translate-y-1 relative ${className}`}
    >
      {/* Clickable Overlay */}
      {href && (
        <a 
          href={href} 
          target={href.startsWith('http') ? '_blank' : undefined}
          rel={href.startsWith('http') ? 'noreferrer' : undefined}
          className="absolute inset-0 z-10" 
          aria-label={title}
        />
      )}

      {/* IMAGE */}
      <div className="w-full h-48 bg-grey-100 dark:bg-grey-700 relative overflow-hidden flex-shrink-0">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            onError={(e) => (e.target.style.display = 'none')}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-grey-200 dark:bg-grey-700 group-hover:scale-105 transition duration-500">
            {imageFallback || <span className="text-grey-400 text-xs font-medium">No Image</span>}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-5 flex-1 flex flex-col justify-start">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 text-grey-900 dark:text-grey-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors font-heading leading-tight">
          {title}
        </h3>
        
        {description && (
          <p className="text-sm text-grey-600 dark:text-grey-400 line-clamp-3 leading-relaxed mb-4 relative z-20 pointer-events-none">
            {description}
          </p>
        )}

        <div className="mt-auto pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate pr-2 relative z-20">
            {/* Source */}
            {source && (
              <span className="text-xs font-bold text-grey-700 dark:text-grey-300">
                {source}
              </span>
            )}
            
            {/* Divider */}
            {source && authorName && authorAvatar === undefined && authorFallback === undefined && (
              <span className="text-xs text-grey-500">/</span>
            )}

            {/* Author (Simple Text) */}
            {authorName && authorAvatar === undefined && authorFallback === undefined && (
              <span className="text-xs text-grey-600 dark:text-grey-400 truncate">
                {!source && 'Tác giả: '}{authorName}
              </span>
            )}

            {/* Author (With Avatar/Fallback) */}
            {authorName && (authorAvatar !== undefined || authorFallback !== undefined) && (
              <a 
                href={authorHref || '#'} 
                className={`flex items-center gap-2 group/author ${authorHref ? 'cursor-pointer' : 'cursor-default pointer-events-none'}`}
                onClick={(e) => { if (!authorHref) e.preventDefault(); }}
              >
                <Avatar 
                  src={authorAvatar} 
                  alt={authorName} 
                  fallback={authorFallback}
                  size="sm" 
                />
                <span className="text-sm font-semibold text-grey-700 dark:text-grey-300 group-hover/author:text-primary-600 dark:group-hover/author:text-primary-400 transition-colors truncate max-w-[120px]">
                  {authorName}
                </span>
              </a>
            )}
          </div>
          
          {/* Date */}
          {date && (
            <span className="text-xs text-grey-500 dark:text-grey-400 font-medium whitespace-nowrap flex-shrink-0 relative z-20 pointer-events-none">
              {date}
            </span>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
