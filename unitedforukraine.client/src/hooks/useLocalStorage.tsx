import { useEffect, useState } from "react";

function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>, () => void] {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = localStorage.getItem(key);
    if (jsonValue != null) return JSON.parse(jsonValue) as T;
    return defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const removeItem = () => {
    localStorage.removeItem(key);
    setValue(defaultValue);
  };

  return [value, setValue, removeItem];
}

export default useLocalStorage;
