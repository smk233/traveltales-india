import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700/80 shadow-sm animate-pulse h-full flex flex-col">
      <div className="bg-gray-200 dark:bg-slate-700 h-48 sm:h-52 w-full" />
      <div className="p-5 flex flex-col flex-grow justify-between gap-4">
        <div>
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-3" />
          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-full mb-1" />
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-5/6" />
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-slate-700" />
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-16" />
          </div>
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-10" />
        </div>
      </div>
    </div>
  );
};

export const FeaturedSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700/80 shadow-sm animate-pulse flex flex-col lg:flex-row h-96">
      <div className="bg-gray-200 dark:bg-slate-700 w-full lg:w-3/5 h-full" />
      <div className="p-6 sm:p-8 w-full lg:w-2/5 flex flex-col justify-between">
        <div>
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3 mb-4" />
          <div className="h-8 bg-gray-200 dark:bg-slate-700 rounded w-4/5 mb-3" />
          <div className="space-y-2 mb-6">
            <div className="h-3.5 bg-gray-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-3.5 bg-gray-200 dark:bg-slate-700 rounded w-full" />
            <div className="h-3.5 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
          </div>
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-slate-700" />
            <div className="space-y-1">
              <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-20" />
              <div className="h-2.5 bg-gray-200 dark:bg-slate-700 rounded w-10" />
            </div>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-12" />
        </div>
      </div>
    </div>
  );
};
