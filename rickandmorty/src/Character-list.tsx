import React from 'react'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuthentication } from './api/auth-utils';
import { fetchRickAndMortyCharacters, deleteCharacter, createCharacter } from './api/axios-functions';
import LogoutButton from './LogoutButton';

// Character Interface - Data Model
interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type?: string;
  gender?: string;
  origin?: {
    name: string;
    url: string;
  };
  location?: {
    name: string;
    url: string;
  };
  image: string;
  episode?: string[];
  created?: string;
}

// Atom - Basic button
const Button = ({ onClick, children }) => {
  return (
    <button onClick={onClick}>{children}</button>
  );
};

// Atom - Input field
const InputField = ({ label, type, value, onChange, name }) => {
  return (
    <div>
      <label>{label}</label>
      <input type={type} value={value} onChange={onChange} name={name} />
    </div>
  );
};

// Atom - Select field
const SelectField = ({ label, value, onChange, options }) => {
  return (
    <div>
      <label>{label}</label>
      <select value={value} onChange={onChange}>
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
};

// Molecule - Pagination controls
const PaginationControls = ({ start, limit, onPrev, onNext }) => {
  return (
    <div>
      <button onClick={onPrev} disabled={start === 0}>Previous</button>
      <span> Page {Math.floor(start / limit) + 1} </span>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

// Organism - Character card
const CharacterCard = ({ character, onDetails, onDelete }) => {
  return (
    <div style={{ margin: '10px', width: '200px' }}>
      <img src={character.image} alt={character.name} style={{ width: '100%' }} />
      <h3>{character.name}</h3>
      <p>Status: {character.status}</p>
      <p>Species: {character.species}</p>
      <button onClick={() => onDetails(character.id)}>Details</button>
      <button onClick={() => onDelete(character.id)}>Delete</button>
    </div>
  );
};

// Organism - Add character form
const AddCharacterForm = ({ onSubmit, onCancel }) => {
  const initialState = {
    name: '',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    origin: { name: 'Earth', url: '' },
    location: { name: 'Earth', url: '' },
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <h2>Add New Character</h2>
      <form onSubmit={handleSubmit}>
        <InputField 
          label="Name" 
          type="text" 
          value={formData.name} 
          onChange={handleChange} 
          name="name" 
        />
        
        <SelectField 
          label="Status" 
          value={formData.status} 
          onChange={handleChange} 
          options={[
            { value: 'Alive', label: 'Alive' },
            { value: 'Dead', label: 'Dead' },
            { value: 'unknown', label: 'Unknown' }
          ]}
        />
        
        <InputField 
          label="Species" 
          type="text" 
          value={formData.species} 
          onChange={handleChange} 
          name="species" 
        />
        
        <InputField 
          label="Type (optional)" 
          type="text" 
          value={formData.type} 
          onChange={handleChange} 
          name="type" 
        />
        
        <SelectField 
          label="Gender" 
          value={formData.gender} 
          onChange={handleChange} 
          options={[
            { value: 'Male', label: 'Male' },
            { value: 'Female', label: 'Female' },
            { value: 'Genderless', label: 'Genderless' },
            { value: 'unknown', label: 'Unknown' }
          ]}
        />
        
        <InputField 
          label="Origin Name" 
          type="text" 
          value={formData.origin.name} 
          onChange={handleChange} 
          name="origin.name" 
        />
        
        <InputField 
          label="Location Name" 
          type="text" 
          value={formData.location.name} 
          onChange={handleChange} 
          name="location.name" 
        />
        
        <InputField 
          label="Image URL" 
          type="text" 
          value={formData.image} 
          onChange={handleChange} 
          name="image" 
        />
        
        <div>
          <button type="button" onClick={onCancel}>Cancel</button>
          <button type="submit">Add Character</button>
        </div>
      </form>
    </div>
  );
};

// Page - Character list
export default function Characterlist() {
  const navigate = useNavigate();
  const [singedin, setSingedin] = useState<boolean>(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [start, setStart] = useState<number>(0);
  const [limit, setLimit] = useState<number>(5);
  const [noResults, setNoResults] = useState<boolean>(false);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  
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
    if (!result.isAuthenticated) {
      navigate('/login');
    }
  }
  
  async function loadCharacters() {
    try {
      const response = await fetchRickAndMortyCharacters(start, start + limit);
      if (response.data && response.data.length > 0) {
        setCharacters(response.data);
        setNoResults(false);
      } else {
        setCharacters([]);
        setNoResults(true);
      }
    } catch (error) {
      console.error('Error loading characters:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
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
  
  function changeLimit(e) {
    setLimit(Number(e.target.value));
    setStart(0);
  }
  
  function goToDetails(id: number) {
    navigate(`/characters/${id}`);
  }
  
  async function handleDelete(id: number) {
    if (window.confirm('Are you sure you want to delete this character?')) {
      try {
        await deleteCharacter(id.toString());
        loadCharacters();
      } catch (error) {
        console.error('Error deleting character:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    }
  }
  
  async function handleAddCharacter(data) {
    try {
      await createCharacter(data);
      setShowAddForm(false);
      loadCharacters();
    } catch (error) {
      console.error('Error adding character:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  }

  return (
    <div>
      <LogoutButton />
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
            <button onClick={() => setShowAddForm(true)}>Add Character</button>
          </div>
          
          {showAddForm && (
            <AddCharacterForm 
              onSubmit={handleAddCharacter}
              onCancel={() => setShowAddForm(false)}
            />
          )}
          
          {noResults ? (
            <h2>Nooothing to seeing here</h2>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {characters.map(character => (
                <CharacterCard 
                  key={character.id}
                  character={character}
                  onDetails={goToDetails}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
          
          <PaginationControls 
            start={start}
            limit={limit}
            onPrev={prevPage}
            onNext={nextPage}
          />
        </>
      ) : (
        <p>Please log in to view characters</p>
      )}
    </div>
  )
}