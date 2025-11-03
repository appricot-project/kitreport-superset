import { useState, useEffect, useCallback } from 'react';

import { MaterialLibraryData } from 'src/features/materialLibrary/types';

const MANIFEST_URL =
  'https://s3.twcstorage.ru/85c86d18-kitreport-document-library/manifest.json';

export function useMaterialManifest() {
  const [data, setData] = useState<MaterialLibraryData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefetchTrigger(prev => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetch(MANIFEST_URL)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        if (isMounted) setData(json);
      })
      .catch(err => {
        if (isMounted) {
          setData(null);
          setError(err);
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [refetchTrigger]);

  return { data, isLoading, error, refetch };
}
