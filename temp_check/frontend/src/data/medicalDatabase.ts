import { DiagnosisCondition } from '../types/entities';

// Banco de dados médico extenso com condições, sintomas, testes e tratamentos
export const medicalConditions: DiagnosisCondition[] = [
  /* Doenças Respiratórias */
  {
    id: 'gripe',
    name: 'Gripe (Influenza)',
    confidence: 0.85,
    description: 'Infecção viral que afeta o sistema respiratório, causando sintomas como febre, dores musculares e fadiga.',
    symptoms: [
      'febre', 'febre alta', 'calafrios', 'dor de cabeça', 'dor no corpo', 'dores musculares',
      'dor nas articulações', 'fadiga', 'cansaço', 'mal-estar', 'tosse', 'tosse seca',
      'tosse persistente', 'dor de garganta', 'congestão nasal', 'nariz entupido', 'coriza'
    ],
    recommendedTests: ['Teste rápido para Influenza', 'PCR para vírus respiratórios', 'Hemograma completo'],
    recommendedTreatments: ['Repouso', 'Hidratação abundante', 'Antitérmicos (paracetamol)', 'Antivirais (Oseltamivir) em casos específicos']
  },
  {
    id: 'covid19',
    name: 'COVID-19',
    confidence: 0.90,
    description: 'Doença infecciosa causada pelo coronavírus SARS-CoV-2, afetando principalmente o sistema respiratório.',
    symptoms: [
      'febre', 'tosse seca', 'tosse persistente', 'cansaço', 'fadiga', 'dor no corpo',
      'dores musculares', 'dor de garganta', 'perda de paladar', 'perda de olfato', 'anosmia',
      'dificuldade para respirar', 'falta de ar', 'dor no peito', 'pressão no peito', 
      'dor de cabeça', 'congestão nasal', 'diarreia', 'náusea'
    ],
    recommendedTests: ['Teste de antígeno', 'RT-PCR', 'Sorologia para COVID-19', 'Tomografia de tórax'],
    recommendedTreatments: ['Isolamento', 'Repouso', 'Hidratação', 'Antitérmicos', 'Monitoramento da oxigenação']
  },
  {
    id: 'pneumonia',
    name: 'Pneumonia',
    confidence: 0.80,
    description: 'Infecção que inflama os sacos aéreos dos pulmões, que podem se encher de líquido.',
    symptoms: [
      'febre', 'febre alta', 'calafrios', 'tosse com catarro', 'tosse com secreção', 'tosse com muco',
      'tosse com sangue', 'dificuldade para respirar', 'falta de ar', 'respiração rápida',
      'dor no peito ao respirar', 'dor no peito ao tossir', 'fadiga', 'cansaço', 'náusea',
      'vômito', 'confusão mental', 'hipotermia', 'suor excessivo'
    ],
    recommendedTests: ['Raio-X de tórax', 'Hemograma completo', 'Hemocultura', 'Análise de escarro', 'Tomografia de tórax'],
    recommendedTreatments: ['Antibióticos', 'Repouso', 'Hidratação', 'Antitérmicos', 'Oxigenoterapia se necessário']
  },
  {
    id: 'bronquite',
    name: 'Bronquite',
    confidence: 0.75,
    description: 'Inflamação dos brônquios, os tubos que levam ar aos pulmões.',
    symptoms: [
      'tosse', 'tosse com catarro', 'tosse persistente', 'produção de muco', 'chiado no peito',
      'dificuldade para respirar', 'falta de ar', 'desconforto no peito', 'dor no peito',
      'fadiga', 'cansaço', 'febre baixa', 'dor de garganta'
    ],
    recommendedTests: ['Raio-X de tórax', 'Testes de função pulmonar', 'Análise de escarro'],
    recommendedTreatments: ['Broncodilatadores', 'Anti-inflamatórios', 'Repouso', 'Hidratação', 'Umidificador de ar']
  },
  {
    id: 'asma',
    name: 'Asma',
    confidence: 0.70,
    description: 'Doença crônica que inflama e estreita as vias aéreas, causando dificuldade para respirar.',
    symptoms: [
      'falta de ar', 'dificuldade para respirar', 'chiado no peito', 'sibilos', 'tosse seca',
      'tosse noturna', 'tosse ao exercício', 'aperto no peito', 'sensação de sufocamento',
      'ansiedade', 'cansaço ao falar', 'respiração rápida'
    ],
    recommendedTests: ['Espirometria', 'Teste de reversibilidade com broncodilatador', 'Medição de óxido nítrico exalado', 'Radiografia de tórax'],
    recommendedTreatments: ['Broncodilatadores de resgate', 'Corticosteroides inalatórios', 'Antileucotrienos', 'Controle de fatores desencadeantes']
  },

  /* Doenças Gastrointestinais */
  {
    id: 'gastrite',
    name: 'Gastrite',
    confidence: 0.75,
    description: 'Inflamação do revestimento do estômago que pode ser aguda ou crônica.',
    symptoms: [
      'dor abdominal', 'dor na barriga', 'dor no estômago', 'queimação estomacal', 'azia',
      'náusea', 'vômito', 'sensação de estômago cheio', 'indigestão', 'perda de apetite',
      'desconforto abdominal', 'inchaço abdominal'
    ],
    recommendedTests: ['Endoscopia digestiva alta', 'Teste para H. pylori', 'Exame de sangue oculto nas fezes'],
    recommendedTreatments: ['Inibidores de bomba de prótons', 'Antiácidos', 'Antibióticos (se H. pylori +)', 'Dieta leve', 'Evitar álcool e alimentos irritantes']
  },
  {
    id: 'ulcera_peptica',
    name: 'Úlcera Péptica',
    confidence: 0.70,
    description: 'Ferida aberta que se desenvolve no revestimento interno do estômago, parte superior do intestino delgado ou esôfago.',
    symptoms: [
      'dor abdominal', 'dor que piora com estômago vazio', 'dor que melhora ao comer', 'azia',
      'indigestão', 'náusea', 'vômito', 'vômito com sangue', 'perda de peso',
      'appetite reduzido', 'fezes escuras', 'sangue nas fezes', 'dor noturna'
    ],
    recommendedTests: ['Endoscopia digestiva alta', 'Teste para H. pylori', 'Exame de sangue oculto nas fezes', 'Radiografia contrastada'],
    recommendedTreatments: ['Inibidores de bomba de prótons', 'Antibióticos (para H. pylori)', 'Antiácidos', 'Evitar alimentos ácidos e condimentados', 'Cessar uso de AINEs']
  },
  {
    id: 'sindrome_intestino_irritavel',
    name: 'Síndrome do Intestino Irritável',
    confidence: 0.65,
    description: 'Distúrbio intestinal crônico que afeta o intestino grosso, causando cólicas, dor abdominal, inchaço, gases e diarreia ou constipação.',
    symptoms: [
      'dor abdominal', 'cólicas', 'dor abdominal aliviada após evacuação', 'inchaço', 'gases',
      'diarreia', 'constipação', 'alternância entre diarreia e constipação', 'muco nas fezes',
      'sensação de evacuação incompleta', 'fadiga', 'distensão abdominal'
    ],
    recommendedTests: ['Exames para descartar outras condições', 'Colonoscopia', 'Exames de sangue', 'Teste de intolerância alimentar'],
    recommendedTreatments: ['Modiöficações dietéticas', 'Antiespasmxódicos', 'Probixóticos', 'Controle do estresse', 'Exercícios físicos']
  },
  {
    id: 'colite_ulcerativa',
    name: 'Colite Ulcerativa',
    confidence: 0.70,
    description: 'Doença inflamatória intestinal que causa inflamação e úlceras no cólon e reto.',
    symptoms: [
      'diarreia com sangue', 'dor abdominal', 'cólicas', 'evacuações urgentes', 'incapacidade de evacuar',
      'perda de peso', 'fadiga', 'febre', 'desidratação', 'náusea', 'sangramento retal'
    ],
    recommendedTests: ['Colonoscopia', 'Sigmoidoscopia', 'Biópsia de tecido', 'Exames de sangue', 'Radiografia abdominal'],
    recommendedTreatments: ['Anti-inflamatórios', 'Imunossupressores', 'Medicamentos biológicos', 'Corticosteroides', 'Cirurgia em casos graves']
  },

  /* Doenças Cardiovasculares */
  {
    id: 'hipertensao',
    name: 'Hipertensão Arterial',
    confidence: 0.85,
    description: 'Pressão arterial elevada que pode levar a sérios problemas de saúde como doenças cardíacas e derrames.',
    symptoms: [
      'dor de cabeça', 'tonturas', 'visão turva', 'zumbido nos ouvidos', 'sangramento nasal',
      'fadiga', 'dificuldade para respirar', 'palpitações', 'dor no peito', 'pressão alta'
    ],
    recommendedTests: ['Medição da pressão arterial', 'Eletrocardiograma', 'Ecocardiograma', 'Exames de sangue', 'Monitoramento ambulatorial da pressão arterial (MAPA)'],
    recommendedTreatments: ['Dieta com baixo teor de sódio', 'Exercícios físicos', 'Redução do estresse', 'Medicamentos anti-hipertensivos', 'Cessar tabagismo']
  },
  {
    id: 'infarto_miocardio',
    name: 'Infarto do Miocárdio',
    confidence: 0.95,
    description: 'Interrupção do fluxo sanguíneo para uma parte do coração, causando danos ou morte do tecido cardíaco.',
    symptoms: [
      'dor no peito', 'pressão no peito', 'aperto no peito', 'dor que irradia para braço esquerdo',
      'dor que irradia para mandíbula', 'dor que irradia para costas', 'falta de ar', 'suor frio',
      'náusea', 'vômito', 'tonturas', 'fadiga extrema', 'ansiedade', 'palpitações'
    ],
    recommendedTests: ['Eletrocardiograma', 'Exames de sangue para enzimas cardíacas', 'Troponina', 'Ecocardiograma', 'Cateterismo cardíaco'],
    recommendedTreatments: ['Asprina', 'Anticoagulantes', 'Trombolíticos', 'Angioplastia', 'Cirurgia de revascularização miocárdica']
  },
  {
    id: 'insuficiencia_cardiaca',
    name: 'Insuficiência Cardíaca',
    confidence: 0.80,
    description: 'Condição em que o coração não consegue bombear sangue suficiente para atender às necessidades do corpo.',
    symptoms: [
      'falta de ar', 'dificuldade para respirar', 'fadiga', 'fraqueza', 'inchaço nas pernas',
      'inchaço nos tornozelos', 'inchaço nos pés', 'batimentos cardíacos rápidos', 'tosse',
      'ganho de peso repentino', 'falta de apetite', 'dificuldade para dormir deitado', 'necessidade de usar mais travesseiros'
    ],
    recommendedTests: ['Eletrocardiograma', 'Ecocardiograma', 'Teste de esforço', 'Raio-X do tórax', 'Catéter cardíaco', 'Exames de sangue'],
    recommendedTreatments: ['Inibidores da ECA', 'Betabloqueadores', 'Diuréticos', 'Restrição de sódio', 'Restrição de líquidos', 'Marca-passo/desfibrilador em casos específicos']
  }
];
