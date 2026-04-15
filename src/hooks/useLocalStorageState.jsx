import {useEffect, useState} from "react";

export function useLocalStorageState(key, initialValue) {
  const [value, setValue] = useState(function () {
    const storeValue = localStorage.getItem(key);
    return storeValue ? JSON.parse(storeValue) : initialValue;
  });

  useEffect(
    function () {
      localStorage.setItem("key", JSON.stringify("value"));
    },
    [key, value],
  );

  return {value, setValue};
}
