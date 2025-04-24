import { adminFirestore } from '../config/firebase-admin';
import { Doctor, User } from '../types/entities';
import { ApiErrorHandler } from '../middlewares/error.middleware';
import { getUserById } from './user.service';
import { v4 as uuidv4 } from 'uuid';

const doctorCollection = adminFirestore.collection('doctors');
const userCollection = adminFirestore.collection('users');

export const createDoctor = async (doctorData: Partial<Doctor>, userId: string): Promise<Doctor> => {
  try {
    // Verificar se o usuário existe
    const user = await getUserById(userId);
    
    if (user.role !== 'doctor') {
      throw new ApiErrorHandler(
        'O usuário não tem o papel de médico',
        400,
        'INVALID_ROLE'
      );
    }
    
    // Verificar se já existe um médico com este userId
    const existingDoctorSnapshot = await doctorCollection
      .where('userId', '==', userId)
      .limit(1)
      .get();
    
    if (!existingDoctorSnapshot.empty) {
      throw new ApiErrorHandler(
        'Já existe um perfil de médico para este usuário',
        409,
        'DOCTOR_ALREADY_EXISTS'
      );
    }
    
    const timestamp = new Date().toISOString();
    
    const newDoctor: Doctor = {
      id: uuidv4(),
      userId,
      specialization: doctorData.specialization || '',
      crm: doctorData.crm || '',
      bio: doctorData.bio || '',
      consultationPrice: doctorData.consultationPrice || 0,
      availableHours: doctorData.availableHours || [],
      rating: 0,
      reviewCount: 0,
      education: doctorData.education || [],
      experience: doctorData.experience || [],
      skills: doctorData.skills || [],
      languages: doctorData.languages || [],
      acceptingNewPatients: doctorData.acceptingNewPatients !== false,
      appointmentDuration: doctorData.appointmentDuration || 30,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    
    await doctorCollection.doc(newDoctor.id).set(newDoctor);
    
    console.log(`Médico criado com sucesso: ${newDoctor.id}`);
    return newDoctor;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao criar médico:', error);
    throw new ApiErrorHandler(
      `Erro ao criar médico: ${error.message}`,
      500,
      'DOCTOR_CREATION_ERROR'
    );
  }
};

export const getDoctorById = async (doctorId: string): Promise<{ doctor: Doctor; user: User }> => {
  try {
    const doctorDoc = await doctorCollection.doc(doctorId).get();
    
    if (!doctorDoc.exists) {
      throw new ApiErrorHandler(
        'Médico não encontrado',
        404,
        'DOCTOR_NOT_FOUND'
      );
    }
    
    const doctor = doctorDoc.data() as Doctor;
    const user = await getUserById(doctor.userId);
    
    return { doctor, user };
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao buscar médico por ID:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar médico: ${error.message}`,
      500,
      'DOCTOR_FETCH_ERROR'
    );
  }
};

export const getDoctorByUserId = async (userId: string): Promise<Doctor> => {
  try {
    const doctorsSnapshot = await doctorCollection
      .where('userId', '==', userId)
      .limit(1)
      .get();
    
    if (doctorsSnapshot.empty) {
      throw new ApiErrorHandler(
        'Médico não encontrado',
        404,
        'DOCTOR_NOT_FOUND'
      );
    }
    
    return doctorsSnapshot.docs[0].data() as Doctor;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao buscar médico por ID de usuário:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar médico: ${error.message}`,
      500,
      'DOCTOR_FETCH_ERROR'
    );
  }
};

export const updateDoctor = async (
  doctorId: string,
  doctorData: Partial<Doctor>
): Promise<Doctor> => {
  try {
    const doctorDoc = await doctorCollection.doc(doctorId).get();
    
    if (!doctorDoc.exists) {
      throw new ApiErrorHandler(
        'Médico não encontrado',
        404,
        'DOCTOR_NOT_FOUND'
      );
    }
    
    // Remover campos que não devem ser atualizados diretamente
    const { id, userId, createdAt, rating, reviewCount, ...updateData } = doctorData;
    
    const updatedDoctor = {
      ...doctorDoc.data(),
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    await doctorCollection.doc(doctorId).update(updatedDoctor);
    
    return updatedDoctor as Doctor;
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao atualizar médico:', error);
    throw new ApiErrorHandler(
      `Erro ao atualizar médico: ${error.message}`,
      500,
      'DOCTOR_UPDATE_ERROR'
    );
  }
};

export const deleteDoctor = async (doctorId: string): Promise<void> => {
  try {
    const doctorDoc = await doctorCollection.doc(doctorId).get();
    
    if (!doctorDoc.exists) {
      throw new ApiErrorHandler(
        'Médico não encontrado',
        404,
        'DOCTOR_NOT_FOUND'
      );
    }
    
    // Desativar o perfil do médico em vez de deletar permanentemente
    await doctorCollection.doc(doctorId).update({
      acceptingNewPatients: false,
      updatedAt: new Date().toISOString()
    });
    
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao deletar médico:', error);
    throw new ApiErrorHandler(
      `Erro ao deletar médico: ${error.message}`,
      500,
      'DOCTOR_DELETE_ERROR'
    );
  }
};

export const getAllDoctors = async (specialization?: string): Promise<{ doctor: Doctor; user: User }[]> => {
  try {
    let query = doctorCollection.where('acceptingNewPatients', '==', true);
    
    if (specialization) {
      query = query.where('specialization', '==', specialization);
    }
    
    const doctorsSnapshot = await query.get();
    const doctorsWithUsers: { doctor: Doctor; user: User }[] = [];
    
    for (const doctorDoc of doctorsSnapshot.docs) {
      const doctor = doctorDoc.data() as Doctor;
      try {
        const user = await getUserById(doctor.userId);
        doctorsWithUsers.push({ doctor, user });
      } catch (error) {
        console.error(`Erro ao buscar usuário do médico ${doctor.id}:`, error);
        // Continuar com o próximo médico
      }
    }
    
    return doctorsWithUsers;
  } catch (error: any) {
    console.error('Erro ao buscar todos os médicos:', error);
    throw new ApiErrorHandler(
      `Erro ao buscar médicos: ${error.message}`,
      500,
      'DOCTORS_FETCH_ERROR'
    );
  }
};

export const searchDoctors = async (searchTerm: string): Promise<{ doctor: Doctor; user: User }[]> => {
  try {
    // Não é possível fazer pesquisa de texto completo diretamente no Firestore
    // Precisamos buscar todos os médicos e filtrar no lado do servidor
    const allDoctors = await getAllDoctors();
    
    return allDoctors.filter(({ doctor, user }) => {
      const searchTermLower = searchTerm.toLowerCase();
      const nameMatch = user.name.toLowerCase().includes(searchTermLower);
      const specializationMatch = doctor.specialization.toLowerCase().includes(searchTermLower);
      const bioMatch = doctor.bio?.toLowerCase().includes(searchTermLower) || false;
      
      return nameMatch || specializationMatch || bioMatch;
    });
  } catch (error: any) {
    console.error('Erro ao pesquisar médicos:', error);
    throw new ApiErrorHandler(
      `Erro ao pesquisar médicos: ${error.message}`,
      500,
      'DOCTORS_SEARCH_ERROR'
    );
  }
};

export const updateDoctorRating = async (
  doctorId: string,
  newRating: number
): Promise<void> => {
  try {
    const doctorDoc = await doctorCollection.doc(doctorId).get();
    
    if (!doctorDoc.exists) {
      throw new ApiErrorHandler(
        'Médico não encontrado',
        404,
        'DOCTOR_NOT_FOUND'
      );
    }
    
    const doctor = doctorDoc.data() as Doctor;
    const currentRating = doctor.rating || 0;
    const currentReviewCount = doctor.reviewCount || 0;
    
    // Calcular nova média de avaliação
    const totalRatingPoints = currentRating * currentReviewCount;
    const newTotalPoints = totalRatingPoints + newRating;
    const newReviewCount = currentReviewCount + 1;
    const updatedRating = newTotalPoints / newReviewCount;
    
    await doctorCollection.doc(doctorId).update({
      rating: updatedRating,
      reviewCount: newReviewCount,
      updatedAt: new Date().toISOString()
    });
    
  } catch (error: any) {
    if (error instanceof ApiErrorHandler) {
      throw error;
    }
    
    console.error('Erro ao atualizar avaliação do médico:', error);
    throw new ApiErrorHandler(
      `Erro ao atualizar avaliação: ${error.message}`,
      500,
      'DOCTOR_RATING_UPDATE_ERROR'
    );
  }
};
