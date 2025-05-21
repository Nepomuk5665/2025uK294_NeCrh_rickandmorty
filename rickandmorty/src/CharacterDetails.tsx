import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCharacterById, updateCharacter, deleteCharacter } from './api/axios-functions';
import { checkAuthentication } from './api/auth-utils';
import LogoutButton from './LogoutButton';

// Character Interface - Data Model
interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  created: string;
  episode: string[];
}

// Atom - Basic input field
const InputField = ({ label, type, value, onChange, name }) => {
  return (
    <div>
      <label>{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={onChange} 
        name={name}
      />
    </div>
  );
};

// Molecule - Character detail item
const DetailItem = ({ label, value }) => {
  return (
    <p>
      <strong>{label}:</strong> {value || 'None'}
    </p>
  );
};

// Organism - Character edit form
const CharacterEditForm = ({ character, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: character.name,
    status: character.status,
    species: character.species,
    type: character.type,
    gender: character.gender
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Edit Character</h2>
      
      <InputField 
        label="Name"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />
      
      <InputField 
        label="Status"
        type="text"
        name="status"
        value={formData.status}
        onChange={handleChange}
      />
      
      <InputField 
        label="Species"
        type="text"
        name="species"
        value={formData.species}
        onChange={handleChange}
      />
      
      <InputField 
        label="Type"
        type="text"
        name="type"
        value={formData.type}
        onChange={handleChange}
      />
      
      <InputField 
        label="Gender"
        type="text"
        name="gender"
        value={formData.gender}
        onChange={handleChange}
      />
      
      <div>
        <button type="button" onClick={onCancel}>Cancel</button>
        <button type="submit">Save Changes</button>
      </div>
    </form>
  );
};

// Page - Character details
export default function CharacterDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  
  useEffect(() => {
    checkAuth();
    loadCharacter();
  }, [id]);
  
  async function checkAuth() {
    const result = await checkAuthentication();
    if (!result.isAuthenticated) {
      navigate('/login');
    }
  }
  
  async function loadCharacter() {
    try {
      setLoading(true);
      if (!id) return;
      
      const response = await fetchCharacterById(id);
      setCharacter(response.data);
    } catch (error) {
      console.error('Error loading character:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }
  
  async function handleSubmit(formData) {
    try {
      if (!id) return;
      
      await updateCharacter(id, formData);
      loadCharacter();
      setEditing(false);
    } catch (error) {
      console.error('Error updating character:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
    }
  }
  
  async function handleDelete() {
    if (window.confirm('Are you sure you want to delete this character?')) {
      try {
        if (!id) return;
        
        await deleteCharacter(id);
        navigate('/characters');
      } catch (error) {
        console.error('Error deleting character:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    }
  }
  
  function handleBack() {
    navigate('/characters');
  }
  
  if (loading) {
    return (
      <div>
        <LogoutButton />
        <h1>Character Details</h1>
        <p>Loading...</p>
      </div>
    );
  }
  
  if (!character) {
    return (
      <div>
        <LogoutButton />
        <h1>Character Details</h1>
        <p>Character not found</p>
        <button onClick={handleBack}>Back to List</button>
      </div>
    );
  }

  return (
    <div>
      <LogoutButton />
      
      <div>
        <h1>Character Details</h1>
        <button onClick={handleBack}>Back to List</button>
      </div>
      
      <div>
        {editing ? (
          <CharacterEditForm 
            character={character}
            onSubmit={handleSubmit}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div>
            <div>
              <button onClick={() => setEditing(true)}>Edit</button>
              <button onClick={handleDelete}>Delete</button>
            </div>
            
            <div>
              <div>
                <img src={character.image} alt={character.name} style={{ width: '200px' }} />
              </div>
              
              <div>
                <h2>{character.name}</h2>
                
                <DetailItem label="ID" value={character.id} />
                <DetailItem label="Status" value={character.status} />
                <DetailItem label="Species" value={character.species} />
                <DetailItem label="Type" value={character.type} />
                <DetailItem label="Gender" value={character.gender} />
                <DetailItem label="Origin" value={character.origin.name} />
                <DetailItem label="Location" value={character.location.name} />
                <DetailItem label="Created" value={new Date(character.created).toLocaleDateString()} />
                <DetailItem label="Episodes" value={character.episode.length} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}