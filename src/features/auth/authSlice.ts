import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import CookieService from '../../services/cookies';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: CookieService.get('jwt') || null,
  isAuthenticated: !!CookieService.get('jwt'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ data: User; token: string }>
    ) => {
      state.user = action.payload.data;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Store in cookie instead of localStorage
      CookieService.set('jwt', action.payload.token, { maxAge: 30 * 24 * 60 * 60 }); // 30 days
      CookieService.set('user', JSON.stringify(action.payload.data), { maxAge: 30 * 24 * 60 * 60 });
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      // Remove from cookies
      CookieService.remove('jwt');
      CookieService.remove('user');
    },
    // Useful for rehydrating user state from cookies on load
    rehydrateUser: (state) => {
      const user = CookieService.get('user');
      if (user) {
        state.user = typeof user === 'string' ? JSON.parse(user) : user;
      }
    }
  },
});

export const { setCredentials, logout, rehydrateUser } = authSlice.actions;
export default authSlice.reducer;
