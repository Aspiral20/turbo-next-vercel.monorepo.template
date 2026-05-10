import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import { UserRolesEnum, UserType } from '@/_types/user.types';

type UserRow = {
  id: string;
  name: string;
  email: string;
  password: string | null;
  role: string;
  email_verified: boolean;
  email_verified_at: string | null;
  onboarding_completed: boolean;
  user_type: string | null;
  country: string | null;
};

function toUserType(row: UserRow): UserType {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as UserRolesEnum,
    password: row.password ?? '',
    emailVerified: row.email_verified ?? false,
    emailVerifiedAt: row.email_verified_at ?? null,
    onboardingCompleted: row.onboarding_completed ?? false,
    userType: row.user_type ?? undefined,
    country: row.country ?? undefined,
  };
}

const USER_FIELDS = 'id, name, email, password, role, email_verified, email_verified_at, onboarding_completed, user_type, country';

export async function getUserByEmail(email: string): Promise<UserType | null> {
  const { data, error } = await supabase
    .from('users')
    .select(USER_FIELDS)
    .eq('email', email.toLowerCase())
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data ? toUserType(data) : null;
}

export async function getUserById(id: string): Promise<UserType | null> {
  const { data, error } = await supabase
    .from('users')
    .select(USER_FIELDS)
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw new Error(error.message);
  return data ? toUserType(data) : null;
}

export async function updateUserPassword(email: string, newPassword: string): Promise<void> {
  const hashed = await bcrypt.hash(newPassword, 10);
  const { error } = await supabase
    .from('users')
    .update({ password: hashed })
    .eq('email', email.toLowerCase());

  if (error) throw new Error(error.message);
}

export async function verifyPassword(plain: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

export async function updateUserProfile(id: string, name: string, country?: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ name, country: country ?? null })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function createUser(name: string, email: string, password: string): Promise<UserType> {
  const existing = await getUserByEmail(email);
  if (existing) throw new Error('EMAIL_TAKEN');

  const hashed = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from('users')
    .insert({ name, email: email.toLowerCase(), password: hashed, role: UserRolesEnum.user })
    .select(USER_FIELDS)
    .single();

  if (error) throw new Error(error.message);
  return toUserType(data);
}

export async function markEmailVerified(email: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ email_verified: true, email_verified_at: new Date().toISOString() })
    .eq('email', email.toLowerCase());
  if (error) throw new Error(error.message);
}

export async function completeOnboarding(userId: string, userType: string, country?: string): Promise<void> {
  const { error } = await supabase
    .from('users')
    .update({ user_type: userType, onboarding_completed: true, country: country ?? null })
    .eq('id', userId);
  if (error) throw new Error(error.message);
}
