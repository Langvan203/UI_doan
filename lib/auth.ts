"use server"

import { cookies } from 'next/headers';

interface User {
  tenNV: string;
  userName: string;
  email: string;
  sdt: string;
  roleName: string[];
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    // Get the user data cookie
    const cookieStore = await cookies();
    const userDataCookie = cookieStore.get('user-data');
    
    if (!userDataCookie) {
      return null;
    }
    
    // Parse user data from cookie
    return JSON.parse(userDataCookie.value) as User;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('auth-token');
    return tokenCookie?.value || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

export async function hasRole(user: User | null, role: string): Promise<boolean> {
  if (!user || !user.roleName) return false;
  return user.roleName.includes(role);
}
