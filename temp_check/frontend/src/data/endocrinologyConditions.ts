import { DiagnosisCondition } from '../types/entities';

// Banco de dados de condiu00e7u00f5es endocrinolu00f3gicas
export const endocrinologyConditions: DiagnosisCondition[] = [
  {
    id: 'diabetes_tipo1',
    name: 'Diabetes Mellitus Tipo 1',
    confidence: 0.90,
    description: 'Doenu00e7a autoimune que destru00f3i as cu00e9lulas produtoras de insulina no pu00e2ncreas, causando altos nu00edveis de glicose no sangue.',
    symptoms: [
      'sede excessiva', 'urinau00e7u00e3o frequente', 'fome extrema', 'perda de peso inexplicada',
      'fadiga', 'visu00e3o turva', 'irritau00e7u00e3o', 'feridas de cicatrizau00e7u00e3o lenta',
      'infecu00e7u00f5es frequentes', 'formigamento nas mu00e3os ou pu00e9s'
    ],
    recommendedTests: ['Glicemia de jejum', 'Teste de hemoglobina glicada (HbA1c)', 'Teste de tolerancia u00e0 glicose', 'Anticorpos pancreu00e1ticos', 'Cetonemia/cetonuria'],
    recommendedTreatments: ['Insulinoterapia', 'Monitoramento da glicose sanguu00ednea', 'Dieta balanceada', 'Exercu00edcios fu00edsicos', 'Educau00e7u00e3o sobre diabetes']
  },
  {
    id: 'diabetes_tipo2',
    name: 'Diabetes Mellitus Tipo 2',
    confidence: 0.85,
    description: 'Condiu00e7u00e3o cru00f4nica que afeta a forma como o corpo metaboliza o au00e7u00facar, causando resistu00eancia u00e0 insulina.',
    symptoms: [
      'sede aumentada', 'urinau00e7u00e3o frequente', 'fome excessiva', 'perda de peso inexplicada',
      'fadiga', 'visu00e3o turva', 'feridas de cicatrizau00e7u00e3o lenta', 'infecu00e7u00f5es recorrentes',
      'formigamento nas mu00e3os e pu00e9s', 'manchas escuras na pele'
    ],
    recommendedTests: ['Glicemia de jejum', 'Teste de hemoglobina glicada (HbA1c)', 'Teste de tolerancia u00e0 glicose', 'Insulina su00e9rica'],
    recommendedTreatments: ['Metformina', 'Inibidores de SGLT2', 'Dieta balanceada', 'Exercu00edcios fu00edsicos', 'Perda de peso', 'Monitoramento da glicose']
  },
  {
    id: 'hipotireoidismo',
    name: 'Hipotireoidismo',
    confidence: 0.80,
    description: 'Condiu00e7u00e3o em que a glu00e2ndula tireu00f3ide nu00e3o produz hormu00f4nios suficientes, afetando o metabolismo e outras funu00e7u00f5es do corpo.',
    symptoms: [
      'fadiga', 'sensibilidade ao frio', 'constipau00e7u00e3o', 'pele seca', 'ganho de peso',
      'inchau00e7o facial', 'voz rouca', 'dores musculares', 'colesterol elevado', 'depressu00e3o',
      'memu00f3ria prejudicada', 'queda de cabelo', 'menstruau00e7u00e3o irregular'
    ],
    recommendedTests: ['TSH', 'T4 livre', 'T3', 'Anticorpos antitireoidianos', 'Ultrassonografia da tireu00f3ide'],
    recommendedTreatments: ['Levotiroxina', 'Acompanhamento endocrinu00f3logo', 'Suplementau00e7u00e3o de iodo (em casos especu00edficos)', 'Dieta balanceada', 'Monitoramento periu00f3dico']
  },
  {
    id: 'hipertireoidismo',
    name: 'Hipertireoidismo',
    confidence: 0.75,
    description: 'Condiu00e7u00e3o em que a glu00e2ndula tireu00f3ide produz hormu00f4nios em excesso, acelerando o metabolismo.',
    symptoms: [
      'perda de peso inesperada', 'taquicardia', 'batimentos cardu00edacos irregulares', 'palpitau00e7u00f5es',
      'aumento do apetite', 'nervosismo', 'ansiedade', 'tremores nas mu00e3os', 'suor excessivo',
      'intoleru00e2ncia ao calor', 'diarreia', 'pele fina', 'exoftu00e1lmica (olhos saltados)', 'menstruau00e7u00e3o irregular'
    ],
    recommendedTests: ['TSH', 'T4 livre', 'T3', 'Anticorpos antirreceptor de TSH', 'Ultrassonografia da tireu00f3ide', 'Cintilografia da tireu00f3ide'],
    recommendedTreatments: ['Antitireoidianos', 'Beta-bloqueadores', 'Iodo radioativo', 'Cirurgia (tireoidectomia)', 'Controle do estresse']
  },
  {
    id: 'sindrome_cushing',
    name: 'Su00edndrome de Cushing',
    confidence: 0.70,
    description: 'Condiu00e7u00e3o causada pela exposiu00e7u00e3o prolongada a altos nu00edveis de cortu00edsu00f3ide (hormu00f4nio do estresse).',
    symptoms: [
      'obesidade central', 'face arredondada (face de lua)', 'corcova dorsu00e1l (giba)', 'estrias purpu00fareas',
      'pele fina e fru00e1gil', 'cansu00e1u00e7o brau00e7os e pernas', 'hipertensu00e3o', 'frau00e7u00e3o u00f3ssea fu00e1cil',
      'fraqueza muscular', 'hirsutismo', 'cicatrizau00e7u00e3o lenta', 'irritau00e7u00e3o', 'alterau00e7u00f5es menstruais'
    ],
    recommendedTests: ['Cortisol urinu00e1rio', 'Cortisol salivar noturno', 'Teste de supressu00e3o com dexametasona', 'ACTH plasmu00e1tico', 'Ressonu00e2ncia magnu00e9tica da hipu00f3fise/adrenais'],
    recommendedTreatments: ['Cirurgia para remover tumor', 'Reduu00e7u00e3o gradual de corticosteroides', 'Mediu00e7u00e3o para bloquear a produu00e7u00e3o de cortisol', 'Radiau00e7u00e3o']
  }
];
