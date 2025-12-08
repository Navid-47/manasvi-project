import { useCallback, useEffect, useState } from 'react';
import { getAllPackages, getPackageById } from '../services/packageService';

export function useFetchPackages(options = {}) {
  const { auto = true } = options;
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(auto);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await Promise.resolve(getAllPackages());
      setPackages(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e || new Error('Failed to load packages'));
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auto) {
      load();
    }
  }, [auto, load]);

  return { packages, loading, error, refetch: load };
}

export function usePackage(packageId) {
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!packageId) {
      setPkg(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await Promise.resolve(getPackageById(packageId));
        if (!cancelled) {
          setPkg(data || null);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e || new Error('Failed to load package'));
          setPkg(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [packageId]);

  return { pkg, loading, error };
}

