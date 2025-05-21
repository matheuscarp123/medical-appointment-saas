import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const analyzeSymptomsWithGPT = async (symptoms: string[]): Promise<{
  diagnoses: Array<{
    name: string;
    probability: number;
    description: string;
    recommendations: string[];
    tests: string[];
    severity: 'low' | 'medium' | 'high';
  }>;
  analysis: string;
}> => {
  try {
    const prompt = `Como um médico especialista, analise os seguintes sintomas e forneça um diagnóstico detalhado:
    Sintomas: ${symptoms.join(', ')}
    
    Por favor, forneça:
    1. Os 3 diagnósticos mais prováveis em ordem de probabilidade
    2. Para cada diagnóstico:
       - Nome da condição
       - Probabilidade estimada (em porcentagem)
       - Breve descrição
       - Recomendações de tratamento
       - Exames recomendados
       - Nível de severidade (baixo, médio ou alto)
    3. Uma análise geral da situação
    
    Formate a resposta em JSON seguindo este modelo:
    {
      "diagnoses": [
        {
          "name": "Nome do diagnóstico",
          "probability": 85,
          "description": "Descrição breve",
          "recommendations": ["recomendação 1", "recomendação 2"],
          "tests": ["exame 1", "exame 2"],
          "severity": "high/medium/low"
        }
      ],
      "analysis": "Análise geral da situação"
    }`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Você é um médico especialista experiente que analisa sintomas e fornece diagnósticos precisos baseados em evidências médicas."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 1000
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result;
  } catch (error) {
    console.error('Erro ao analisar sintomas com GPT:', error);
    throw new Error('Falha ao analisar sintomas com IA. Por favor, tente novamente.');
  }
};
