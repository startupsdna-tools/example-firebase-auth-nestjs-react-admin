import { Route } from 'react-router-dom';
import { AccountPage } from './AccountPage';

export const accountRoute = () => (
  <Route path="account" element={<AccountPage />} />
);
