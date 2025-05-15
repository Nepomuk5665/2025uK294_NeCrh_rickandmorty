import React from 'react'
import { useState, useEffect } from 'react';
import { checkAuthentication } from './api/auth-utils';
import { fetchRickAndMortyCharacters, getAuthToken } from './api/axios-functions';

interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  image: string;
}

export default function Characterlist() {
  const [singedin, setSingedin] = useState<boolean>(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [start, setStart] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  
  useEffect(() => {
    onLoad();
  }, []);

  useEffect(() => {
    if (singedin) {
      loadCharacters();
    }
  }, [singedin, start, limit]);

  async function onLoad() {
    const result = await checkAuthentication();
    setSingedin(result.isAuthenticated);
  }
  
  async function loadCharacters() {
    try {
      const token = getAuthToken();
      if (!token) return;
      
      const response = await fetchRickAndMortyCharacters(start, start + limit, token);
      setCharacters(response.data);
    } catch (error) {
      console.error('Error loading characters:', error);
    }
  }
  
  function nextPage() {
    setStart(start + limit);
  }
  
  function prevPage() {
    if (start >= limit) {
      setStart(start - limit);
    }
  }
  
  function changeLimit(e: React.ChangeEvent<HTMLSelectElement>) {
    setLimit(Number(e.target.value));
    setStart(0);
  }

  return (
    <div>
      <h1>Character List:</h1>
      
      {singedin ? (
        <>
          <div>
            <label>
              Characters per page: 
              <select value={limit} onChange={changeLimit}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </label>
          </div>
          
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {characters.map(character => (
              <div key={character.id} style={{ margin: '10px', width: '200px' }}>
                <img src={character.image} alt={character.name} style={{ width: '100%' }} />
                <h3>{character.name}</h3>
                <p>Status: {character.status}</p>
                <p>Species: {character.species}</p>
              </div>
            ))}
          </div>
          
          <div>
            <button onClick={prevPage} disabled={start === 0}>Previous</button>
            <span> Page {Math.floor(start / limit) + 1} </span>
            <button onClick={nextPage}>Next</button>
          </div>
        </>
      ) : (
        <p>Please log in to view characters</p>
      )}
    </div>
  )
}