export function sanitizeUser(user: Record<string, any> | null) {
  if (!user) return user;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...safeUser } = user;
  return safeUser;
}

export function createTokenPayload(user: {
  id: number;
  email: string;
  id_rol: number;
  rol?: { nombre_rol: string };
}) {
  return {
    sub: user.id,
    email: user.email,
    roleId: user.id_rol,
    role: user.rol?.nombre_rol ?? user.id_rol,
  };
}
