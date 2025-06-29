import { useEffect, useState } from 'react';

export function useUserCode() {
  const [userCode, setUserCode] = useState(null);

  useEffect(() => {
    let code = localStorage.getItem('memoka_user_code');
    if (!code) {
      code = crypto.randomUUID().slice(0, 8); // generate kode unik 8 karakter
      localStorage.setItem('memoka_user_code', code);
    }
    setUserCode(code);
  }, []);

  return userCode;
}
