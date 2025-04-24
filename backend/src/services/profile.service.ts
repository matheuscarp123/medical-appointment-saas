import { adminFirestore } from '../config/firebase-admin';
import { ApiErrorHandler } from '../middlewares/error.middleware';

export async function getProfile(uid: string) {
  // Busca perfil do usuário (pode ser user, doctor ou patient)
  const userDoc = await adminFirestore.collection('users').doc(uid).get();
  if (!userDoc.exists) throw ApiErrorHandler.notFound('Usuário não encontrado');
  return { uid, ...userDoc.data() };
}

export async function updateProfile(uid: string, profileData: any) {
  // Atualiza perfil do usuário (campos permitidos)
  await adminFirestore.collection('users').doc(uid).update(profileData);
  const updatedDoc = await adminFirestore.collection('users').doc(uid).get();
  return { uid, ...updatedDoc.data() };
}
