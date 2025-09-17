import { redirect } from 'next/navigation';
import React, { Suspense } from 'react';
import { Results, ResultsSkeleton } from './_components/results';

// Accept searchParams as a Promise type
interface SearchPageProps {
  searchParams: Promise<{ term?: string }>;
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  // Await the searchParams
  const params = await searchParams;

  if (!params.term) {
    redirect("/");
  }

  return (
    <div className='h-full p-8 max-w-screen-2xl mx-auto'>
      <Suspense fallback={<ResultsSkeleton />}>
        <Results term={params.term} />
      </Suspense>
    </div>
  );
};

export default SearchPage;
