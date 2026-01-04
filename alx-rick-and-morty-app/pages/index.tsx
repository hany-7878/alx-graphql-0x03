import { useQuery } from "@apollo/client/react";
import { GET_EPISODES } from "@/graphql/queries";
import { EpisodeProps } from "@/interfaces";
import EpisodeCard from "@/components/common/EpisodeCard";
import { useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import ErrorProneComponent from "@/components/ErrorProneComponent";

interface EpisodesInfo {
  pages: number;
  next: number | null;
  prev: number | null;
  count: number;
}

interface EpisodesData {
  episodes: {
    info: EpisodesInfo;
    results: EpisodeProps[];
  } | null;
}

const Home: React.FC = () => {
  const [page, setPage] = useState<number>(1);

  // Apollo query with optional page & filter
  const { loading, error, data } = useQuery<EpisodesData, { page?: number; filter?: null }>(
    GET_EPISODES,
    {
      variables: { page, filter: null },
    }
  );

  if (loading) return <h1>Loading...</h1>;
  if (error) return <h1>Error fetching episodes</h1>;
  if (!data?.episodes) return <h1>No episodes found</h1>;

  const { results, info } = data.episodes;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#A3D5E0] to-[#F4F4F4] text-gray-800">
      {/* Header */}
      <header className="bg-[#4CA1AF] text-white py-6 text-center shadow-md">
        <h1 className="text-4xl font-bold tracking-wide">Rick and Morty Episodes</h1>
        <p className="mt-2 text-lg italic">Explore the multiverse of adventures!</p>
      </header>

      {/* Main */}
      <main className="grow p-6">
        {/* Episodes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map(({ id, name, air_date, episode }: EpisodeProps) => (
            <EpisodeCard key={id} id={id} name={name} air_date={air_date} episode={episode} />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            className="bg-[#45B69C] text-white font-semibold py-2 px-6 rounded-lg shadow-lg"
            disabled={!info?.prev}
          >
            Previous
          </button>
          <button
            onClick={() => setPage(prev => (info?.next ? prev + 1 : prev))}
            className="bg-[#45B69C] text-white font-semibold py-2 px-6 rounded-lg shadow-lg"
            disabled={!info?.next}
          >
            Next
          </button>
        </div>

        {/* Error-Prone Component */}
        <div className="mt-10">
          <ErrorBoundary>
            <ErrorProneComponent />
          </ErrorBoundary>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#4CA1AF] text-white py-4 text-center shadow-md">
        <p>&copy; 2024 Rick and Morty Fan Page</p>
      </footer>
    </div>
  );
};

export default Home;
