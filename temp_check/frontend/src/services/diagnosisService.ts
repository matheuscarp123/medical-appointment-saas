import { collection, addDoc, getDocs, where, query, Timestamp, DocumentData, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { DiagnosisSuggestion, DiagnosisCondition } from '../types/entities';

// Importando todas as bases de dados médicas
import { medicalConditions } from '../data/medicalDatabase';
import { neurologicalConditions } from '../data/neurologicalConditions';
import { endocrinologyConditions } from '../data/endocrinologyConditions';

// Coleção do Firestore para salvar diagnósticos
const COLLECTION = 'diagnosis_suggestions';

// Atualização da base de conhecimento com doenças comuns e seus sintomas específicos
const commonDiseases: DiagnosisCondition[] = [
  {
    id: 'gripe',
    name: 'Gripe',
    confidence: 0.9,
    description: 'A gripe é uma infecção respiratória aguda causada pelo vírus Influenza. É altamente contagiosa e geralmente apresenta início súbito dos sintomas.',
    symptoms: ['febre', 'dor no corpo', 'tosse', 'dor de garganta', 'cansaço', 'dor de cabeça'],
    recommendedTests: ['Teste rápido para Influenza', 'Avaliação clínica'],
    recommendedTreatments: ['Repouso', 'Hidratação', 'Antitérmicos', 'Analgésicos', 'Observação de sintomas de alerta']
  },
  {
    id: 'covid-19',
    name: 'COVID-19',
    confidence: 0.9,
    description: 'A COVID-19 é uma doença infecciosa causada pelo coronavírus SARS-CoV-2 e apresenta ampla variação clínica, desde casos assintomáticos até manifestações respiratórias graves.',
    symptoms: ['febre', 'tosse seca', 'perda de olfato', 'perda de paladar', 'cansaço', 'dor no corpo', 'diarreia', 'dor de garganta'],
    recommendedTests: ['Teste RT-PCR', 'Teste rápido de antígeno', 'Teste sorológico', 'Avaliação de oximetria'],
    recommendedTreatments: ['Isolamento domiciliar', 'Repouso', 'Hidratação', 'Antitérmicos', 'Monitoramento de sintomas de alerta']
  },
  {
    id: 'dengue',
    name: 'Dengue',
    confidence: 0.9,
    description: 'A dengue é uma doença febril aguda, transmitida pela picada do mosquito Aedes aegypti infectado pelo vírus da dengue, comum em regiões tropicais e subtropicais.',
    symptoms: ['febre alta', 'dor atrás dos olhos', 'dor no corpo', 'manchas na pele', 'dor de cabeça', 'náusea'],
    recommendedTests: ['Hemograma completo', 'Teste NS1', 'Sorologia para dengue', 'Prova do laço'],
    recommendedTreatments: ['Hidratação abundante', 'Repouso', 'Antitérmicos (exceto AAS)', 'Evitar automedicação', 'Monitoramento de plaquetas']
  },
  {
    id: 'resfriado',
    name: 'Resfriado Comum',
    confidence: 0.9,
    description: 'O resfriado comum é uma infecção viral branda das vias aéreas superiores, geralmente autolimitada e de curta duração.',
    symptoms: ['coriza', 'espirros', 'dor de garganta leve', 'tosse leve', 'congestão nasal'],
    recommendedTests: ['Avaliação clínica'],
    recommendedTreatments: ['Repouso adequado', 'Hidratação', 'Descongestionantes nasais', 'Analgésicos leves', 'Umidificação do ambiente']
  },
  {
    id: 'sinusite',
    name: 'Sinusite',
    confidence: 0.9,
    description: 'A sinusite é uma inflamação dos seios paranasais, geralmente causada por infecção viral, bacteriana ou alérgica, resultando em acúmulo de muco e pressão.',
    symptoms: ['dor de cabeça', 'dor na face', 'congestão nasal', 'secreção amarelada', 'febre'],
    recommendedTests: ['Avaliação clínica', 'Endoscopia nasal', 'Tomografia computadorizada (casos persistentes)'],
    recommendedTreatments: ['Antibióticos (se bacteriana)', 'Descongestionantes', 'Analgésicos', 'Irrigação nasal', 'Corticoides nasais']
  },
  {
    id: 'amigdalite',
    name: 'Amigdalite',
    confidence: 0.9,
    description: 'A amigdalite é uma inflamação das amígdalas, geralmente causada por infecção viral ou bacteriana, resultando em dor de garganta e dificuldade para engolir.',
    symptoms: ['dor de garganta intensa', 'febre', 'dificuldade para engolir', 'gânglios inchados'],
    recommendedTests: ['Exame físico da garganta', 'Teste rápido para Streptococcus', 'Cultura de orofaringe'],
    recommendedTreatments: ['Antibióticos (se bacteriana)', 'Analgésicos', 'Gargarejos com água morna e sal', 'Hidratação adequada', 'Repouso vocal']
  }
];

// Dicionário de sinônimos e termos relacionados para cada sintoma
const symptomsSynonyms: Record<string, string[]> = {
  // Sintomas da gripe e resfriado
  'febre': ['febre', 'febre alta', 'febre baixa', 'temperatura elevada', 'hipertermia', 'febril', 'quente', 'temperatura corporal aumentada'],
  'dor no corpo': ['dor no corpo', 'dores musculares', 'mialgia', 'dor muscular', 'corpo dolorido', 'dores nas juntas', 'corpo doendo', 'dor generalizada'],
  'tosse': ['tosse', 'tosse seca', 'tosse produtiva', 'tossindo', 'tosse com catarro', 'pigarro', 'tosse persistente'],
  'dor de garganta': ['dor de garganta', 'garganta inflamada', 'garganta irritada', 'faringite', 'amigdalite', 'dor ao engolir', 'garganta dolorida'],
  'cansaço': ['cansaço', 'fadiga', 'exaustão', 'fraqueza', 'falta de energia', 'prostração', 'letargia', 'sem disposição'],
  'dor de cabeça': ['dor de cabeça', 'cefaleia', 'cabeça doendo', 'cabeça latejando', 'enxaqueca', 'cefaleia tensional'],
  
  // Sintomas específicos da COVID-19
  'perda de olfato': ['perda de olfato', 'anosmia', 'não sentir cheiro', 'perda do olfato', 'diminuição do olfato', 'alteração do olfato'],
  'perda de paladar': ['perda de paladar', 'ageusia', 'não sentir gosto', 'perda do paladar', 'alteração do paladar', 'diminuição do paladar'],
  'diarreia': ['diarreia', 'fezes líquidas', 'evacuar frequentemente', 'evacuação aquosa', 'fezes amolecidas', 'intestino solto'],
  
  // Sintomas específicos da dengue
  'febre alta': ['febre alta', 'febre intensa', 'febre persistente', 'temperatura muito elevada', 'pirexia intensa'],
  'dor atrás dos olhos': ['dor atrás dos olhos', 'dor retrocular', 'dor ocular', 'olhos doloridos', 'pressão atrás dos olhos'],
  'manchas na pele': ['manchas na pele', 'exantema', 'rash cutâneo', 'petéquias', 'erupção cutânea', 'vermelhidão na pele'],
  'náusea': ['náusea', 'enjoo', 'vontade de vomitar', 'enjôo', 'mal-estar gástrico', 'estômago embrulhado'],
  
  // Sintomas específicos do resfriado
  'coriza': ['coriza', 'nariz escorrendo', 'rinorreia', 'secreção nasal', 'corrimento nasal'],
  'espirros': ['espirros', 'espirrando', 'espirros frequentes', 'esternutação', 'espirro em crise'],
  'congestão nasal': ['congestão nasal', 'nariz entupido', 'obstrução nasal', 'nariz congestionado', 'dificuldade para respirar pelo nariz'],
  
  // Sintomas específicos da sinusite
  'dor na face': ['dor na face', 'dor facial', 'pressão facial', 'dor no rosto', 'pressão nos seios da face'],
  'secreção amarelada': ['secreção amarelada', 'secreção purulenta', 'catarro amarelo', 'secreção nasal amarela', 'secreção esverdeada'],
  
  // Sintomas específicos da amigdalite
  'dor de garganta intensa': ['dor de garganta intensa', 'dor de garganta severa', 'garganta muito inflamada', 'dor intensa ao engolir', 'odinofagia grave'],
  'dificuldade para engolir': ['dificuldade para engolir', 'disfagia', 'dor ao engolir', 'dificuldade de deglutição', 'não conseguir engolir'],
  'gânglios inchados': ['gânglios inchados', 'linfonodos aumentados', 'ínguas', 'adenomegalia', 'inchaço no pescoço']
};

// Pesos dos sintomas por doença para cálculo de score
const symptomWeightsByDisease: Record<string, Record<string, number>> = {
  'gripe': {
    'febre': 0.3,
    'dor no corpo': 0.2,
    'tosse': 0.15,
    'dor de garganta': 0.15,
    'cansaço': 0.1,
    'dor de cabeça': 0.1
  },
  'covid-19': {
    'febre': 0.2,
    'tosse seca': 0.15,
    'perda de olfato': 0.25,
    'perda de paladar': 0.25,
    'cansaço': 0.05,
    'dor no corpo': 0.05,
    'diarreia': 0.025,
    'dor de garganta': 0.025
  },
  'dengue': {
    'febre alta': 0.3,
    'dor atrás dos olhos': 0.25,
    'dor no corpo': 0.15,
    'manchas na pele': 0.15,
    'dor de cabeça': 0.1,
    'náusea': 0.05
  },
  'resfriado': {
    'coriza': 0.3,
    'espirros': 0.25,
    'dor de garganta leve': 0.2,
    'tosse leve': 0.15,
    'congestão nasal': 0.1
  },
  'sinusite': {
    'dor de cabeça': 0.25,
    'dor na face': 0.25,
    'congestão nasal': 0.2,
    'secreção amarelada': 0.2,
    'febre': 0.1
  },
  'amigdalite': {
    'dor de garganta intensa': 0.4,
    'febre': 0.2,
    'dificuldade para engolir': 0.2,
    'gânglios inchados': 0.2
  }
};

// Função para normalizar texto (remover acentos, converter para minúsculas)
const normalizeText = (text: string): string => {
  return text.trim().toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

// Função para expandir um sintoma com seus sinônimos
const expandSymptomWithSynonyms = (symptom: string): string[] => {
  const normalized = normalizeText(symptom);
  
  let synonyms: string[] = [symptom.trim().toLowerCase()];
  
  // Verificar correspondências no dicionário de sinônimos
  for (const [key, values] of Object.entries(symptomsSynonyms)) {
    // Verificar se o sintoma está na lista de sinônimos
    if (values.some(v => normalizeText(v) === normalized) || normalizeText(key) === normalized) {
      synonyms = [...Array.from(new Set([...synonyms, key, ...values]))];
      break;
    }
  }
  
  return synonyms.filter(s => s.trim() !== '');
};

// Função para verificar se um sintoma corresponde ou está relacionado a outro
const areSymptomsSimilar = (symptom1: string, symptom2: string): boolean => {
  const normalized1 = normalizeText(symptom1);
  const normalized2 = normalizeText(symptom2);
  
  // Verificação direta
  if (normalized1 === normalized2) return true;
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;
  
  // Verificação por sinônimos
  const synonyms1 = expandSymptomWithSynonyms(symptom1);
  const synonyms2 = expandSymptomWithSynonyms(symptom2);
  
  return synonyms1.some(s1 => 
    synonyms2.some(s2 => 
      normalizeText(s1).includes(normalizeText(s2)) || 
      normalizeText(s2).includes(normalizeText(s1))
    )
  );
};

// Função para avaliar a gravidade com base nos sintomas e combinações específicas
const assessSeverity = (matchedSymptoms: string[]): 'low' | 'medium' | 'high' => {
  const normalizedSymptoms = matchedSymptoms.map(s => normalizeText(s));
  
  // Sintomas de alta gravidade
  const highSeveritySymptoms = [
    'febre alta', 'dificuldade respiratoria', 'falta de ar severa',
    'confusao mental', 'dor no peito intensa', 'cianose', 'desmaio'
  ].map(s => normalizeText(s));
  
  // Sintomas de média gravidade
  const mediumSeveritySymptoms = [
    'febre persistente', 'tosse persistente', 'dor de garganta intensa',
    'manchas na pele', 'dor abdominal forte', 'dificuldade para engolir'
  ].map(s => normalizeText(s));
  
  // Verificar combinações de alto risco
  if (normalizedSymptoms.some(s => highSeveritySymptoms.includes(s))) {
    return 'high';
  }
  
  // COVID-19 com múltiplos sintomas característicos
  const covidSpecificSymptoms = ['perda de olfato', 'perda de paladar'].map(s => normalizeText(s));
  if (normalizedSymptoms.some(s => covidSpecificSymptoms.includes(s)) && 
      (normalizedSymptoms.includes(normalizeText('febre')) || normalizedSymptoms.includes(normalizeText('tosse seca')))) {
    return 'medium';
  }
  
  // Dengue com sintomas característicos
  if (normalizedSymptoms.includes(normalizeText('febre alta')) && 
      (normalizedSymptoms.includes(normalizeText('dor atrás dos olhos')) || 
       normalizedSymptoms.includes(normalizeText('manchas na pele')))) {
    return 'medium';
  }
  
  // Verificar sintomas de média gravidade
  if (normalizedSymptoms.some(s => mediumSeveritySymptoms.includes(s))) {
    return 'medium';
  }
  
  // Padrão: gravidade baixa
  return 'low';
};

// Função para gerar texto de recomendação com base no diagnóstico
const generateRecommendationText = (diagnosis: DiagnosisCondition, severity: 'low' | 'medium' | 'high'): string => {
  let recommendation = `Com base nos sintomas apresentados, a sugestão de diagnóstico é ${diagnosis.name}. `;
  
  if (severity === 'high') {
    recommendation += `ATENÇÃO: Seus sintomas indicam uma condição que pode ser grave. Recomendamos buscar atendimento médico imediatamente.`;
  } else if (severity === 'medium') {
    recommendation += `Recomendamos consultar um médico para avaliação clínica nas próximas 24 horas. `;
  } else {
    recommendation += `Os sintomas parecem leves neste momento. `;
  }
  
  recommendation += `\n\nExames recomendados: ${diagnosis.recommendedTests?.join(', ') || 'A critério médico'}.`;
  recommendation += `\n\nTratamentos geralmente indicados: ${diagnosis.recommendedTreatments?.join(', ')}. Lembre-se que estas são apenas sugestões e o tratamento deve ser prescrito por um profissional de saúde.`;
  
  return recommendation;
};

// Função principal para gerar diagnóstico
export const searchDiagnosisByKeyword = async (
  patientId: string,
  patientName: string,
  doctorId: string,
  doctorName: string,
  keywords: string[]
): Promise<DiagnosisSuggestion> => {
  try {
    console.log('Analisando sintomas para diagnóstico:', keywords);
    
    // Validar e filtrar sintomas
    const validSymptoms = keywords.filter(s => s && typeof s === 'string' && s.trim().length > 0);
    if (validSymptoms.length === 0) {
      throw new Error('Nenhum sintoma válido fornecido');
    }
    
    // Expandir sintomas com sinônimos
    const expandedSymptoms = validSymptoms.flatMap(expandSymptomWithSynonyms);
    const uniqueSymptoms = Array.from(new Set(expandedSymptoms));
    
    // Calcular pontuação para cada doença com base nos sintomas fornecidos
    const scoredDiseases = commonDiseases.map(disease => {
      const matchingSymptoms: string[] = [];
      let totalScore = 0;
      
      // Para cada sintoma da doença, verificar se corresponde a algum dos sintomas do usuário
      disease.symptoms.forEach(diseaseSymptom => {
        const matched = uniqueSymptoms.find(userSymptom => 
          areSymptomsSimilar(diseaseSymptom, userSymptom)
        );
        
        if (matched) {
          matchingSymptoms.push(diseaseSymptom);
          
          // Usar o peso específico deste sintoma para esta doença
          const weight = symptomWeightsByDisease[disease.id]?.[diseaseSymptom] || 1.0;
          totalScore += weight;
        }
      });
      
      // Calcular proporção de sintomas correspondentes
      const matchRatio = matchingSymptoms.length / disease.symptoms.length;
      
      // Calcular confiança final (média ponderada entre pontuação e razão de correspondência)
      let confidence = matchingSymptoms.length > 0 
        ? (totalScore * 0.7) + (matchRatio * 0.3) 
        : 0;
      
      // Normalizar confiança para estar entre 0 e 1
      confidence = Math.min(1.0, confidence);
      
      return {
        ...disease,
        confidence,
        matchingSymptoms
      };
    });
    
    // Filtrar doenças sem correspondência e ordenar por confiança
    const relevantDiagnoses = scoredDiseases
      .filter(disease => disease.matchingSymptoms.length > 0)
      .sort((a, b) => b.confidence - a.confidence);
    
    // Pegar as 3 melhores correspondências
    let topDiagnoses = relevantDiagnoses.slice(0, 3);
    
    // Se não tiver 3 diagnósticos relevantes, adicionar o restante com baixa confiança
    if (topDiagnoses.length < 3) {
      const additionalDiagnoses = scoredDiseases
        .filter(disease => !topDiagnoses.some(d => d.id === disease.id))
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3 - topDiagnoses.length)
        .map(disease => ({
          ...disease,
          confidence: Math.max(0.1, disease.confidence), // Garantir confiança mínima
          matchingSymptoms: disease.matchingSymptoms
        }));
      
      topDiagnoses = [...topDiagnoses, ...additionalDiagnoses];
    }
    
    // Avaliar gravidade geral com base nos sintomas correspondentes
    const allMatchedSymptoms = Array.from(new Set(
      topDiagnoses.flatMap(d => d.matchingSymptoms)
    ));
    const severity = assessSeverity(allMatchedSymptoms);
    
    // Criar texto de recomendação para o diagnóstico principal
    const recommendation = topDiagnoses.length > 0 
      ? generateRecommendationText(topDiagnoses[0], severity) 
      : 'Não foi possível determinar um diagnóstico preciso. Recomendamos consultar um médico.';
    
    // Adicionar classes visuais de prioridade
    const visualClasses: ('high-probability' | 'medium-probability' | 'low-probability')[] = 
      ['high-probability', 'medium-probability', 'low-probability'];
    
    const diagnosesWithVisual = topDiagnoses.map((diagnosis, index) => ({
      ...diagnosis,
      visualClass: visualClasses[Math.min(index, visualClasses.length - 1)],
      // Arredondar confiança para melhor visualização
      confidence: Math.round(diagnosis.confidence * 100) / 100
    }));
    
    // Extrair todos os testes e tratamentos recomendados
    const recommendedTests = Array.from(new Set(
      topDiagnoses.flatMap(d => d.recommendedTests || [])
    ));
    
    const recommendedTreatments = Array.from(new Set(
      topDiagnoses.flatMap(d => d.recommendedTreatments || [])
    ));
    
    // Criar objeto de sugestão de diagnóstico
    const diagnosisSuggestion: DiagnosisSuggestion = {
      id: `diag-${Date.now()}`,
      patientId,
      patientName,
      doctorId,
      doctorName,
      symptoms: uniqueSymptoms,
      suggestedDiagnoses: diagnosesWithVisual,
      description: recommendation,
      recommendedTests,
      recommendedTreatments,
      severity,
      createdAt: new Date(),
      disclaimer: 'Este diagnóstico é apenas uma sugestão preliminar baseada nos sintomas relatados e não substitui a consulta com um profissional de saúde qualificado.'
    };
    
    // Salvar no banco de dados
    try {
      const diagnosisRef = await addDoc(collection(db, 'diagnosis_suggestions'), {
        ...diagnosisSuggestion,
        createdAt: Timestamp.fromDate(diagnosisSuggestion.createdAt)
      });
      
      console.log('Diagnóstico salvo com sucesso, ID:', diagnosisRef.id);
      diagnosisSuggestion.id = diagnosisRef.id;
    } catch (error) {
      console.error('Erro ao salvar diagnóstico:', error);
    }
    
    return diagnosisSuggestion;
    
  } catch (error) {
    console.error('Erro ao processar diagnóstico:', error);
    throw new Error('Falha ao processar diagnóstico');
  }
};

/**
 * Salvar uma sugestão de diagnóstico
 */
export const saveDiagnosisSuggestion = async (diagnosis: DiagnosisSuggestion): Promise<string> => {
  try {
    const diagnosisRef = await addDoc(collection(db, 'diagnosis_suggestions'), {
      ...diagnosis,
      createdAt: Timestamp.fromDate(diagnosis.createdAt)
    });
    
    return diagnosisRef.id;
  } catch (error) {
    console.error('Erro ao salvar diagnóstico:', error);
    throw new Error('Falha ao salvar diagnóstico');
  }
};

/**
 * Obter diagnósticos por paciente
 */
export const getDiagnosisSuggestionsByPatient = async (patientId: string): Promise<DiagnosisSuggestion[]> => {
  try {
    const q = query(
      collection(db, 'diagnosis_suggestions'),
      where('patientId', '==', patientId),
      where('createdAt', '!=', null)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        patientId: data.patientId,
        patientName: data.patientName,
        doctorId: data.doctorId,
        doctorName: data.doctorName,
        symptoms: data.symptoms || [],
        suggestedDiagnoses: data.suggestedDiagnoses || [],
        description: data.description,
        recommendedTests: data.recommendedTests || [],
        recommendedTreatments: data.recommendedTreatments || [],
        severity: data.severity || 'low',
        createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
        disclaimer: data.disclaimer
      } as DiagnosisSuggestion;
    });
  } catch (error) {
    console.error('Erro ao buscar diagnósticos do paciente:', error);
    throw new Error('Falha ao buscar diagnósticos');
  }
};

/**
 * Obter diagnósticos por médico
 */
export const getDiagnosisSuggestionsByDoctor = async (doctorId: string): Promise<DiagnosisSuggestion[]> => {
  try {
    const q = query(
      collection(db, 'diagnosis_suggestions'),
      where('doctorId', '==', doctorId),
      where('createdAt', '!=', null)
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        patientId: data.patientId,
        patientName: data.patientName,
        doctorId: data.doctorId,
        doctorName: data.doctorName,
        symptoms: data.symptoms || [],
        suggestedDiagnoses: data.suggestedDiagnoses || [],
        description: data.description,
        recommendedTests: data.recommendedTests || [],
        recommendedTreatments: data.recommendedTreatments || [],
        severity: data.severity || 'low',
        createdAt: data.createdAt,
        disclaimer: data.disclaimer
      } as DiagnosisSuggestion;
    });
  } catch (error) {
    console.error('Erro ao buscar diagnósticos do médico:', error);
    throw new Error('Falha ao buscar diagnósticos');
  }
};

/**
 * Get a specific diagnosis suggestion by ID
 * @param id - The ID of the diagnosis suggestion to retrieve
 * @returns The diagnosis suggestion, or null if not found
 */
export const getDiagnosisSuggestionById = async (id: string): Promise<DiagnosisSuggestion | null> => {
  try {
    const docRef = doc(db, 'diagnosis_suggestions', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as DiagnosisSuggestion;
    } else {
      console.log('No such diagnosis suggestion found!');
      return null;
    }
  } catch (error) {
    console.error('Error getting diagnosis suggestion:', error);
    throw error;
  }
};

/**
 * Delete a diagnosis suggestion by ID
 * @param id - The ID of the diagnosis suggestion to delete
 */
export const deleteDiagnosisSuggestion = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, 'diagnosis_suggestions', id);
    await deleteDoc(docRef);
    console.log('Diagnosis suggestion deleted successfully');
  } catch (error) {
    console.error('Error deleting diagnosis suggestion:', error);
    throw error;
  }
};
