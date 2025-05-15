import React from 'react'
import { useState, useEffect } from 'react';
import { checkAuthentication } from './api/auth-utils';

export default function Characterlist() {
  const [singedin, setSingedin] = useState<boolean>(false);

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    const result = await checkAuthentication();
    setSingedin(result.isAuthenticated);
  }

  return (
    <div>
      <h1>Character List:</h1>
    </div>
  )
}