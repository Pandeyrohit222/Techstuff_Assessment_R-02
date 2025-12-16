'use client';

import { useEffect, useState } from 'react';

const LIMIT = 10;

export default function PokePage() {
  const [pokemons, setPokemons] = useState([]);
  const [count, setCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [activeType, setActiveType] = useState(0);

  useEffect(() => {
    fetchPokemons(page);
    setSelectedPokemon(null);
    // eslint-disable-next-line
  }, [page]);

  const fetchPokemons = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const offset = (pageNumber - 1) * LIMIT;
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${LIMIT}`);
      if (!res.ok) throw new Error('Failed to fetch Pokémon data');
      const data = await res.json();
      setPokemons(data.results);
      setCount(data.count);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };
  const handleNext = () => {
    if (LIMIT * page < count) setPage(page + 1);
  };
  const handlePokemonClick = async (pokemon) => {
    setDetailLoading(true);
    setDetailError(null);
    setSelectedPokemon(null);
    setActiveType(0);
    try {
      const res = await fetch(pokemon.url);
      if (!res.ok) throw new Error('Could not fetch Pokémon details');
      const data = await res.json();
      setSelectedPokemon(data);
    } catch (err) {
      setDetailError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  const pageCount = Math.ceil(count / LIMIT);

  return (
    <div className="max-w-4xl mx-auto pt-8 px-4">
      <h1 className="text-3xl font-extrabold mb-4">Pokémon Table</h1>
      {error && (
        <div className="mb-4">
          <span className="text-red-600 font-semibold">{error}</span>
        </div>
      )}
      <div className="bg-white shadow rounded-lg min-h-[200px] mb-8 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left font-semibold">Sr. No.</th>
              <th className="px-4 py-2 text-left font-semibold">Poke Name</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="text-center py-8">
                  Loading...
                </td>
              </tr>
            ) : pokemons.length > 0 ? (
              pokemons.map((pokemon, idx) => (
                <tr
                  key={pokemon.name}
                  className="hover:bg-blue-50 cursor-pointer"
                  onClick={() => handlePokemonClick(pokemon)}
                >
                  <td className="px-4 py-2">
                    {(page - 1) * LIMIT + idx + 1}
                  </td>
                  <td className="px-4 py-2 font-medium text-blue-700 text-lg">
                    {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center py-8">
                  No Pokémon found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4 mb-8">
        <span>Total: {count}</span>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-60"
          >
            Prev.
          </button>
          <span className="font-semibold mx-2">{page}</span>
          <button
            onClick={handleNext}
            disabled={page >= pageCount}
            className="px-4 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-60"
          >
            Next
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <div className="w-full md:w-1/2">
          {/* Table Section (Left) - Already above */}
        </div>
        <div className="w-full md:w-1/2 min-w-[340px]">
          {/* Detail Section (Right) */}
          {detailLoading && (
            <div className="flex justify-center mt-6">
              <span className="loader w-8 h-8 border-4 border-t-4 border-blue-600 rounded-full animate-spin" />
            </div>
          )}
          {detailError && (
            <div className="mt-4 text-red-700 font-semibold border border-red-200 bg-red-50 rounded p-2">
              {detailError}
            </div>
          )}
          {selectedPokemon && !detailLoading && (
            <div>
              <h2 className="text-2xl font-bold mb-2">
                {selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1)}
              </h2>
              <div className="flex border-b border-gray-200 max-w-xs mb-2 overflow-x-auto">
                {selectedPokemon.types.map((typeInfo, idx) => (
                  <button
                    key={typeInfo.type.name}
                    onClick={() => setActiveType(idx)}
                    className={`px-4 py-2 text-sm font-semibold focus:outline-none transition border-0 border-b-2 ${activeType === idx
                      ? "border-blue-600 text-blue-700"
                      : "border-transparent text-gray-700"
                    }`}
                  >
                    {typeInfo.type.name.charAt(0).toUpperCase() + typeInfo.type.name.slice(1)}
                  </button>
                ))}
              </div>
              {selectedPokemon.types.map((typeInfo, idx) => (
                <div key={typeInfo.type.name} hidden={activeType !== idx} className="mt-2">
                  <div>Game Indices: <b>{selectedPokemon.game_indices.length}</b></div>
                  <div>Moves: <b>{selectedPokemon.moves.length}</b></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
