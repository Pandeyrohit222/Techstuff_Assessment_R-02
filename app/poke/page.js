'use client';

import { useEffect, useState } from 'react';
import {
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Pagination,
} from '@mui/material';

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
    <Container maxWidth="md" sx={{ pt: 4 }}>
      <Typography variant="h4" gutterBottom>Pokémon Table</Typography>
      {error && (
        <Box mb={2}><Typography color="error">{error}</Typography></Box>
      )}
      <TableContainer component={Paper} sx={{ minHeight: 400 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sr. No.</TableCell>
              <TableCell>Poke Name</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : pokemons.length > 0 ? (
              pokemons.map((pokemon, idx) => (
                <TableRow key={pokemon.name} hover style={{ cursor: 'pointer' }} onClick={() => handlePokemonClick(pokemon)}>
                  <TableCell>{(page - 1) * LIMIT + idx + 1}</TableCell>
                  <TableCell sx={{ fontWeight: 500, fontSize: 18, color: '#1976d2' }}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No Pokémon found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
        <Typography>Total: {count}</Typography>
        <Box>
          <Button onClick={handlePrev} disabled={page === 1} sx={{ mr: 1 }}>Prev.</Button>
          <Typography component="span" sx={{ mx: 1 }}>{page}</Typography>
          <Button onClick={handleNext} disabled={page >= pageCount}>Next</Button>
        </Box>
      </Box>
      <Box display="flex" gap={4} mt={4}>
        <Box flex={1}>
          {/* Table Section (Left) */}
          <TableContainer component={Paper} sx={{ minHeight: 400 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Sr. No.</TableCell>
                  <TableCell>Poke Name</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <CircularProgress size={28} />
                    </TableCell>
                  </TableRow>
                ) : pokemons.length > 0 ? (
                  pokemons.map((pokemon, idx) => (
                    <TableRow key={pokemon.name} hover style={{ cursor: 'pointer' }} onClick={() => handlePokemonClick(pokemon)}>
                      <TableCell>{(page - 1) * LIMIT + idx + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 500, fontSize: 18, color: '#1976d2' }}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No Pokémon found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
            <Typography>Total: {count}</Typography>
            <Box>
              <Button onClick={handlePrev} disabled={page === 1} sx={{ mr: 1 }}>Prev.</Button>
              <Typography component="span" sx={{ mx: 1 }}>{page}</Typography>
              <Button onClick={handleNext} disabled={page >= pageCount}>Next</Button>
            </Box>
          </Box>
        </Box>
        <Box flex={1} minWidth={340}>
          {/* Detail Section (Right) */}
          {detailLoading && <Box mt={4}><CircularProgress /></Box>}
          {detailError && <Alert severity="error">{detailError}</Alert>}
          {selectedPokemon && !detailLoading && (
            <Box>
              <Typography variant="h4" fontWeight={700} mb={2}>
                {selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1)}
              </Typography>
              <Tabs value={activeType} onChange={(e, v) => setActiveType(v)} variant="scrollable" sx={{ mb: 2, borderBottom: 1, borderColor: 'divider', maxWidth: 400 }}>
                {selectedPokemon.types.map((typeInfo, idx) => (
                  <Tab key={typeInfo.type.name} label={typeInfo.type.name.charAt(0).toUpperCase()+typeInfo.type.name.slice(1)} />
                ))}
              </Tabs>
              {selectedPokemon.types.map((typeInfo, idx) => (
                <div key={typeInfo.type.name} hidden={activeType !== idx}>
                  <Typography>Game Indices: <b>{selectedPokemon.game_indices.length}</b></Typography>
                  <Typography>Moves: <b>{selectedPokemon.moves.length}</b></Typography>
                </div>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
}

