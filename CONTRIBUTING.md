# Guia de Contribuição

Obrigado pelo seu interesse em contribuir com o MediFlow! Este documento fornece as diretrizes e passos para contribuir com o projeto.

## Código de Conduta

Este projeto e todos os participantes estão sujeitos ao nosso Código de Conduta. Ao participar, você concorda em manter este código.

## Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Padrões de Código

- Use TypeScript para todo o código novo
- Siga o estilo de código existente
- Mantenha o código limpo e bem documentado
- Escreva testes para novas funcionalidades
- Atualize a documentação conforme necessário

## Processo de Desenvolvimento

1. **Planejamento**
   - Discuta a feature/bug em uma issue
   - Obtenha aprovação da equipe
   - Defina os requisitos e critérios de aceitação

2. **Desenvolvimento**
   - Siga as diretrizes de estilo de código
   - Escreva testes unitários
   - Mantenha os commits pequenos e focados

3. **Revisão**
   - Crie um Pull Request
   - Responda aos comentários dos revisores
   - Faça as alterações necessárias

4. **Merge**
   - Aguarde a aprovação dos revisores
   - Resolva quaisquer conflitos
   - Merge após a aprovação

## Configuração do Ambiente de Desenvolvimento

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env.development
```

3. Inicie o servidor de desenvolvimento:
```bash
npm start
```

## Testes

- Execute os testes antes de submeter um PR:
```bash
npm test
```

- Verifique a cobertura de testes:
```bash
npm run test:coverage
```

## Linting e Formatação

- Execute o linter:
```bash
npm run lint
```

- Formate o código:
```bash
npm run format
```

## Documentação

- Mantenha o README.md atualizado
- Documente novas funcionalidades
- Atualize a documentação da API quando necessário

## Commits

Use mensagens de commit claras e descritivas seguindo o formato:

```
tipo(escopo): descrição

[corpo opcional]

[rodapé opcional]
```

Tipos de commit:
- feat: nova funcionalidade
- fix: correção de bug
- docs: alterações na documentação
- style: formatação, ponto e vírgula, etc
- refactor: refatoração de código
- test: adição ou alteração de testes
- chore: atualizações de build, configurações, etc

## Dúvidas?

Se você tiver dúvidas ou precisar de ajuda, abra uma issue ou entre em contato com a equipe de manutenção. 