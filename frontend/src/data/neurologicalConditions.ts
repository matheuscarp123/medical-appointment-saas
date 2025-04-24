import { DiagnosisCondition } from '../types/entities';

// Banco de dados de condições neurológicas
export const neurologicalConditions: DiagnosisCondition[] = [
  {
    id: 'enxaqueca',
    name: 'Enxaqueca',
    confidence: 0.80,
    description: 'Dor de cabeça intensa e recorrente que pode causar dor pulsante ou latejante, geralmente de um lado da cabeça.',
    symptoms: [
      'dor de cabeça intensa', 'dor pulsante', 'dor latejante', 'dor unilateral', 'sensibilidade à luz',
      'sensibilidade ao som', 'náusea', 'vômito', 'visão turva', 'aura visual',
      'tontura', 'formigamento', 'dificuldade de concentração'
    ],
    recommendedTests: ['Avaliação neurológica', 'Ressonancia magnética', 'Tomografia computadorizada', 'Eletroencefalograma'],
    recommendedTreatments: ['Analgésicos', 'Anti-inflamatórios', 'Triptanos', 'Antiepilepticos', 'Terapias preventivas', 'Ambiente escuro e silencioso']
  },
  {
    id: 'alzheimer',
    name: 'Doença de Alzheimer',
    confidence: 0.75,
    description: 'Doença neurodegenerativa progressiva que causa problemas com memória, pensamento e comportamento.',
    symptoms: [
      'perda de memória', 'esquecimento frequente', 'confusão', 'desorientação',
      'dificuldade para resolver problemas', 'dificuldade com tarefas familiares', 'problemas de linguagem',
      'confusão sobre tempo ou lugar', 'mudanças de humor', 'dificuldade com planejamento', 'retraimento social'
    ],
    recommendedTests: ['Avaliação neurocognitiva', 'Ressonancia magnética cerebral', 'PET scan', 'Exames de sangue', 'Avaliação psicológica'],
    recommendedTreatments: ['Inibidores de colinesterase', 'Memantina', 'Terapia cognitiva', 'Atividades de estimulação cognitiva', 'Suporte familiar']
  },
  {
    id: 'epilepsia',
    name: 'Epilepsia',
    confidence: 0.85,
    description: 'Distúrbio neurológico crônico caracterizado por convulsões recorrentes devido a atividade elétrica anormal no cérebro.',
    symptoms: [
      'convulsões', 'espasmos', 'perda de consciência', 'rigidez muscular', 'confusão temporária',
      'movimento descontrolado', 'sensações incomuns', 'mudanças sensoriais', 'alterações de comportamento',
      'olhar fixo', 'urinação involuntária', 'alucinações'
    ],
    recommendedTests: ['Eletroencefalograma (EEG)', 'Ressonancia magnética', 'Tomografia computadorizada', 'Exames de sangue', 'Punção lombar'],
    recommendedTreatments: ['Anticonvulsivantes', 'Cirurgia para epilepsia', 'Estimulação do nervo vago', 'Dieta cetogênica', 'Evitar desencadeadores']
  },
  {
    id: 'acidente_vascular_cerebral',
    name: 'AVC (Acidente Vascular Cerebral)',
    confidence: 0.95,
    description: 'Interrupção do fluxo sanguíneo para o cérebro, causando morte de células cerebrais devido à falta de oxigênio e nutrientes.',
    symptoms: [
      'dormência ou fraqueza súbita na face', 'dormência ou fraqueza no braço ou perna', 'confusão',
      'dificuldade para falar', 'dificuldade para compreender', 'problemas visuais', 'tontura',
      'perda de equilíbrio', 'dificuldade para andar', 'dor de cabeça súbita e intensa', 'desmaio'
    ],
    recommendedTests: ['Tomografia computadorizada', 'Ressonância magnética', 'Angiografia cerebral', 'Ecocardiograma', 'Ultrassom carotídeo', 'Exames de sangue'],
    recommendedTreatments: ['Trombolíticos (AVC isquêmico)', 'Anticoagulantes', 'Controle da pressão arterial', 'Fisioterapia', 'Terapia ocupacional', 'Fonoaudiologia', 'Cirurgia (em casos específicos)']
  }
];
