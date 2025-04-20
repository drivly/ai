import { useSession } from '../lib/auth/auth-client';

export const useAuthResult = ({ initialAuthResult, getAuthResult }: any) => {
  return initialAuthResult;
};

export const useCommand = () => {
  return {};
};

export * from '../lib/auth/auth-client';
