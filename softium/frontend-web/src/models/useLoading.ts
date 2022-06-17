import { useState, useCallback } from 'react';

export default function useLoading() {
  const [loading, setLoading] = useState<boolean>(false);
  return {
    loading,
    setLoading,
  };
}
