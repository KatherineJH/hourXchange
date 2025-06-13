// src/hooks/useHasEmail.js
import { useSelector } from 'react-redux';

/**
 * Redux state.auth.email 값이 존재하는지 여부를 반환합니다.
 * @returns {boolean} 이메일이 있으면 true, 없으면 false
 */
export function useHasEmail() {
    const email = useSelector((state) => state.auth.email);
    return Boolean(email);
}
