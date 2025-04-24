interface Diagnosis {
  condition: string;
  symptoms: string[];
  medications: string[];
  severity: 'baixa' | 'média' | 'alta';
  specialties: string[];
  icd10?: string;
  description: string;
  probability: number;
  commonAgeGroups?: string[];
  riskFactors?: string[];
  preventiveMeasures?: string[];
}

export interface SymptomCategories {
  [key: string]: string[];
}

export const symptomCategories: SymptomCategories = {
  dor: [
    'dor de cabeça',
    'dor abdominal',
    'dor nas costas',
    'dor no peito',
    'dor muscular',
    'dor nas articulações',
    'dor de garganta',
    'dor ao urinar',
  ],
  respiratórios: [
    'tosse',
    'falta de ar',
    'congestão nasal',
    'espirros',
    'chiado no peito',
    'respiração rápida',
  ],
  gastrointestinais: [
    'náusea',
    'vômito',
    'diarreia',
    'constipação',
    'azia',
    'gases',
    'indigestão',
  ],
  neurológicos: [
    'tontura',
    'dor de cabeça',
    'confusão mental',
    'desmaio',
    'convulsões',
    'formigamento',
    'fraqueza muscular',
  ],
  cardiovasculares: [
    'palpitações',
    'dor no peito',
    'falta de ar',
    'pressão alta',
    'inchaço nas pernas',
  ],
  psicológicos: [
    'ansiedade',
    'depressão',
    'insônia',
    'irritabilidade',
    'mudanças de humor',
    'fadiga',
  ],
  dermatológicos: [
    'coceira',
    'erupção cutânea',
    'vermelhidão',
    'manchas',
    'acne',
    'ressecamento',
  ],
};

export const medicalDatabase: Diagnosis[] = [
  {
    condition: "COVID-19",
    symptoms: [
      "febre",
      "tosse seca",
      "fadiga",
      "perda de olfato",
      "perda de paladar",
      "dificuldade respiratória",
      "dor de cabeça",
      "dor no corpo"
    ],
    medications: [
      "Paracetamol",
      "Ibuprofeno",
      "Antiviral (sob prescrição médica)",
      "Corticoides (casos graves)"
    ],
    severity: "alta",
    specialties: ["Infectologia", "Pneumologia"],
    icd10: "U07.1",
    description: "Doença infecciosa causada pelo coronavírus SARS-CoV-2",
    probability: 0.8,
    riskFactors: ["idade avançada", "doenças crônicas", "obesidade", "imunossupressão"],
    preventiveMeasures: ["vacinação", "uso de máscara", "higiene das mãos", "distanciamento social"]
  },
  {
    condition: "Hipertensão Arterial",
    symptoms: [
      "dor de cabeça",
      "tontura",
      "visão embaçada",
      "zumbido no ouvido",
      "mal estar",
      "dor no peito",
      "falta de ar"
    ],
    medications: [
      "Losartana",
      "Enalapril",
      "Anlodipino",
      "Hidroclorotiazida",
      "Atenolol"
    ],
    severity: "alta",
    specialties: ["Cardiologia"],
    icd10: "I10",
    description: "Pressão arterial cronicamente elevada",
    probability: 0.75,
    riskFactors: ["obesidade", "sedentarismo", "histórico familiar", "idade avançada"],
    preventiveMeasures: ["dieta saudável", "exercícios físicos", "redução do sal", "controle do estresse"]
  },
  {
    condition: "Diabetes Mellitus Tipo 2",
    symptoms: [
      "sede excessiva",
      "urinar frequentemente",
      "fome excessiva",
      "perda de peso",
      "fadiga",
      "visão embaçada",
      "cicatrização lenta"
    ],
    medications: [
      "Metformina",
      "Glibenclamida",
      "Insulina",
      "Empagliflozina",
      "Sitagliptina"
    ],
    severity: "alta",
    specialties: ["Endocrinologia"],
    icd10: "E11",
    description: "Distúrbio metabólico caracterizado por altos níveis de glicose no sangue",
    probability: 0.7,
    riskFactors: ["obesidade", "sedentarismo", "histórico familiar", "má alimentação"],
    preventiveMeasures: ["dieta balanceada", "exercícios físicos", "controle do peso", "monitoramento da glicose"]
  },
  {
    condition: "Ansiedade Generalizada",
    symptoms: [
      "preocupação excessiva",
      "inquietação",
      "irritabilidade",
      "dificuldade de concentração",
      "tensão muscular",
      "problemas de sono",
      "palpitações",
      "sudorese"
    ],
    medications: [
      "Sertralina",
      "Escitalopram",
      "Alprazolam",
      "Buspirona",
      "Venlafaxina"
    ],
    severity: "média",
    specialties: ["Psiquiatria", "Psicologia"],
    icd10: "F41.1",
    description: "Transtorno caracterizado por ansiedade e preocupação excessivas",
    probability: 0.65,
    riskFactors: ["estresse", "trauma", "histórico familiar", "isolamento social"],
    preventiveMeasures: ["terapia", "exercícios físicos", "meditação", "sono adequado"]
  },
  {
    condition: "Asma",
    symptoms: [
      "falta de ar",
      "chiado no peito",
      "tosse",
      "aperto no peito",
      "dificuldade para respirar",
      "tosse noturna"
    ],
    medications: [
      "Salbutamol",
      "Budesonida",
      "Formoterol",
      "Beclometasona",
      "Montelucaste"
    ],
    severity: "média",
    specialties: ["Pneumologia", "Alergologia"],
    icd10: "J45",
    description: "Doença inflamatória crônica das vias aéreas",
    probability: 0.7,
    riskFactors: ["alergias", "histórico familiar", "exposição a irritantes", "obesidade"],
    preventiveMeasures: ["evitar alérgenos", "vacinação", "controle ambiental", "exercícios respiratórios"]
  },
  {
    condition: "Gastrite",
    symptoms: [
      "dor abdominal",
      "azia",
      "náusea",
      "vômito",
      "indigestão",
      "perda de apetite",
      "sensação de estufamento"
    ],
    medications: [
      "Omeprazol",
      "Pantoprazol",
      "Ranitidina",
      "Sucralfato",
      "Antiácidos"
    ],
    severity: "média",
    specialties: ["Gastroenterologia"],
    icd10: "K29",
    description: "Inflamação da mucosa do estômago",
    probability: 0.75,
    riskFactors: ["estresse", "má alimentação", "uso de anti-inflamatórios", "H. pylori"],
    preventiveMeasures: ["dieta adequada", "evitar álcool", "controle do estresse", "refeições regulares"]
  },
  {
    condition: "Enxaqueca",
    symptoms: [
      "dor de cabeça intensa",
      "sensibilidade à luz",
      "sensibilidade a sons",
      "náusea",
      "vômito",
      "aura visual",
      "tontura"
    ],
    medications: [
      "Sumatriptano",
      "Propranolol",
      "Topiramato",
      "Amitriptilina",
      "Anti-inflamatórios"
    ],
    severity: "média",
    specialties: ["Neurologia"],
    icd10: "G43",
    description: "Cefaleia primária caracterizada por dor pulsátil intensa",
    probability: 0.7,
    riskFactors: ["estresse", "hormônios", "alimentos específicos", "privação de sono"],
    preventiveMeasures: ["identificar gatilhos", "sono regular", "exercícios", "dieta adequada"]
  },
  {
    condition: "Artrite Reumatoide",
    symptoms: [
      "dor nas articulações",
      "rigidez matinal",
      "inchaço articular",
      "fadiga",
      "fraqueza",
      "febre baixa",
      "perda de apetite"
    ],
    medications: [
      "Metotrexato",
      "Leflunomida",
      "Sulfassalazina",
      "Prednisona",
      "Anti-inflamatórios"
    ],
    severity: "alta",
    specialties: ["Reumatologia"],
    icd10: "M05",
    description: "Doença autoimune que afeta principalmente as articulações",
    probability: 0.65,
    riskFactors: ["genética", "sexo feminino", "tabagismo", "idade"],
    preventiveMeasures: ["exercícios", "fisioterapia", "controle do peso", "proteção articular"]
  },
  {
    condition: "Síndrome do Intestino Irritável",
    symptoms: [
      "dor abdominal",
      "alteração do hábito intestinal",
      "diarreia",
      "constipação",
      "gases",
      "inchaço abdominal",
      "muco nas fezes"
    ],
    medications: [
      "Antiespasmódicos",
      "Probióticos",
      "Loperamida",
      "Antidepressivos (casos específicos)",
      "Fibras"
    ],
    severity: "baixa",
    specialties: ["Gastroenterologia"],
    icd10: "K58",
    description: "Distúrbio funcional do intestino",
    probability: 0.7,
    riskFactors: ["estresse", "ansiedade", "intolerâncias alimentares", "histórico familiar"],
    preventiveMeasures: ["dieta adequada", "gerenciamento do estresse", "exercícios", "sono regular"]
  },
  {
    condition: "Hipotireoidismo",
    symptoms: [
      "fadiga",
      "ganho de peso",
      "intolerância ao frio",
      "constipação",
      "pele seca",
      "depressão",
      "dores musculares"
    ],
    medications: [
      "Levotiroxina",
      "Liotironina",
      "Suplementos de iodo",
      "Vitamina D",
      "Vitamina B12"
    ],
    severity: "média",
    specialties: ["Endocrinologia"],
    icd10: "E03",
    description: "Produção insuficiente de hormônios tireoidianos",
    probability: 0.7,
    riskFactors: ["sexo feminino", "idade", "histórico familiar", "doenças autoimunes"],
    preventiveMeasures: ["exames regulares", "dieta equilibrada", "suplementação adequada"]
  },
  {
    condition: "Rinite Alérgica",
    symptoms: [
      "espirros",
      "coriza",
      "congestão nasal",
      "coceira no nariz",
      "coceira nos olhos",
      "lacrimejamento",
      "tosse"
    ],
    medications: [
      "Loratadina",
      "Desloratadina",
      "Fexofenadina",
      "Corticoides nasais",
      "Descongestionantes"
    ],
    severity: "baixa",
    specialties: ["Alergologia", "Otorrinolaringologia"],
    icd10: "J30",
    description: "Inflamação da mucosa nasal causada por alérgenos",
    probability: 0.8,
    riskFactors: ["histórico familiar", "exposição a alérgenos", "poluição", "mudanças climáticas"],
    preventiveMeasures: ["controle ambiental", "filtros de ar", "higiene nasal", "evitar alérgenos"]
  },
  {
    condition: "Depressão Maior",
    symptoms: [
      "tristeza persistente",
      "perda de interesse",
      "alterações no sono",
      "alterações no apetite",
      "fadiga",
      "dificuldade de concentração",
      "pensamentos negativos",
      "ideação suicida"
    ],
    medications: [
      "Fluoxetina",
      "Sertralina",
      "Escitalopram",
      "Venlafaxina",
      "Bupropiona"
    ],
    severity: "alta",
    specialties: ["Psiquiatria", "Psicologia"],
    icd10: "F32",
    description: "Transtorno do humor caracterizado por tristeza profunda e persistente",
    probability: 0.7,
    riskFactors: ["histórico familiar", "trauma", "estresse crônico", "isolamento social"],
    preventiveMeasures: ["terapia regular", "exercícios", "sono adequado", "suporte social"]
  },
  {
    condition: "Infecção do Trato Urinário",
    symptoms: [
      "dor ao urinar",
      "urgência urinária",
      "frequência urinária aumentada",
      "dor lombar",
      "urina turva",
      "sangue na urina",
      "febre"
    ],
    medications: [
      "Nitrofurantoína",
      "Ciprofloxacino",
      "Amoxicilina",
      "Sulfametoxazol + Trimetoprima",
      "Analgésicos"
    ],
    severity: "média",
    specialties: ["Urologia", "Ginecologia"],
    icd10: "N39.0",
    description: "Infecção bacteriana do trato urinário",
    probability: 0.8,
    riskFactors: ["sexo feminino", "atividade sexual", "diabetes", "cálculos renais"],
    preventiveMeasures: ["hidratação adequada", "higiene íntima", "urinar após relações", "evitar retenção"]
  }
];

export interface SymptomMatch {
  symptom: string;
  matchedTerms: string[];
}

export const calculateDiagnosis = (symptoms: string[]): Diagnosis[] => {
  // Normaliza os sintomas para minúsculas e remove acentos
  const normalizedSymptoms = symptoms.map(s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""));
  
  // Função para verificar se um sintoma corresponde a um termo do banco de dados
  const matchesSymptom = (symptom: string, databaseSymptom: string): boolean => {
    const normalizedDBSymptom = databaseSymptom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return normalizedDBSymptom.includes(symptom) || symptom.includes(normalizedDBSymptom);
  };

  const results = medicalDatabase.map(diagnosis => {
    // Para cada sintoma informado, verifica quantos sintomas da condição correspondem
    const matchingSymptoms = normalizedSymptoms.filter(symptom =>
      diagnosis.symptoms.some(s => matchesSymptom(symptom, s))
    );

    // Calcula o score baseado em vários fatores
    const symptomMatchScore = matchingSymptoms.length / diagnosis.symptoms.length;
    const severityMultiplier = 
      diagnosis.severity === 'alta' ? 1.2 :
      diagnosis.severity === 'média' ? 1.0 : 0.8;
    
    // Ajusta a probabilidade base com os fatores calculados
    const adjustedProbability = 
      diagnosis.probability * 
      symptomMatchScore * 
      severityMultiplier;

    return {
      ...diagnosis,
      probability: adjustedProbability
    };
  });

  // Filtra resultados com probabilidade maior que 0.1 e ordena por probabilidade
  return results
    .filter(result => result.probability > 0.1)
    .sort((a, b) => b.probability - a.probability)
    .slice(0, 3);
};

// Função para sugerir sintomas baseado em entrada parcial
export const suggestSymptoms = (partialSymptom: string): string[] => {
  const normalizedPartial = partialSymptom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  // Coleta todos os sintomas únicos do banco de dados
  const allSymptoms = new Set<string>();
  medicalDatabase.forEach(diagnosis => {
    diagnosis.symptoms.forEach(symptom => allSymptoms.add(symptom));
  });

  // Filtra sintomas que correspondem à entrada parcial
  return Array.from(allSymptoms)
    .filter(symptom => {
      const normalizedSymptom = symptom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return normalizedSymptom.includes(normalizedPartial);
    })
    .slice(0, 5); // Retorna até 5 sugestões
};
