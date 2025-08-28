# Módulo de Chamada - Sistema NeonEducacional

## 📋 Funcionalidades Implementadas

### Controle de Presença por Turno
- **Turno da Manhã**: Lista alunos configurados para estudar pela manhã
- **Turno da Tarde**: Lista alunos configurados para estudar pela tarde  
- **Filtro Automático por Dia**: Mostra apenas alunos que têm aula no dia atual da semana

### Sistema de Presença
- **Presente**: Aluno compareceu normalmente
- **Falta**: Aluno não compareceu  
- **Atraso**: Aluno chegou atrasado
- **Observação**: Situação especial com campo de texto obrigatório

### Validações
- ✅ Todos os alunos devem ter uma situação selecionada
- ✅ Alunos marcados como "Observação" devem ter texto preenchido
- ✅ Não permite salvar chamada incompleta

### Estrutura de Dados
```javascript
// Coleção: chamadas
{
  data: "2025-08-28T00:00:00.000Z",
  turno: "Manhã", // ou "Tarde"
  diaSemana: "Quarta",
  registros: [
    {
      alunoId: "aluno123",
      alunoNome: "João Silva",
      situacao: "presente", // presente|falta|atraso|observacao
      observacao: "Texto opcional",
      responsavelId: "resp456"
    }
  ],
  totalAlunos: 15,
  presentes: 12,
  faltas: 2,
  atrasos: 1,
  observacoes: 0,
  criadoEm: "2025-08-28T14:30:00.000Z"
}
```

## 🎯 Regras de Negócio

### Filtros Automáticos
1. **Por Turno**: Manhã ou Tarde (selecionável)
2. **Por Dia da Semana**: Automaticamente filtra alunos que estudam no dia atual
3. **Por Configuração do Aluno**: Campo `diasSemana` e `turno` na coleção de alunos

### IDs Únicos
- Formato: `YYYY-MM-DD_turno` (ex: `2025-08-28_manha`)
- Previne duplicação de chamadas no mesmo dia/turno

### Interface Responsiva
- **Desktop**: Cards em grid 3 colunas
- **Tablet**: Cards em grid 2 colunas  
- **Mobile**: Cards em coluna única

## 🔧 Dependências

### Coleções Appwrite Necessárias
- **alunos**: Dados dos estudantes com `turno` e `diasSemana`
- **chamadas**: Nova coleção para armazenar registros de presença

### Campos Obrigatórios na Coleção Alunos
```javascript
{
  nome: String,
  turno: String, // "Manhã" ou "Tarde"
  diasSemana: Array, // ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"]
  responsavelId: String
}
```

## 📱 Fluxo de Uso

1. **Acesso ao Módulo**: Usuário acessa página de chamada
2. **Seleção de Turno**: Escolhe entre Manhã ou Tarde
3. **Visualização da Lista**: Sistema mostra alunos filtrados automaticamente
4. **Marcação de Presença**: Para cada aluno, seleciona uma das 4 opções
5. **Observações**: Se necessário, preenche campo de texto
6. **Validação**: Sistema verifica se todos têm situação marcada
7. **Salvamento**: Registra chamada na base de dados
8. **Confirmação**: Exibe mensagem de sucesso

## 🎨 Recursos Visuais

### Indicadores de Status
- 🟢 **Presente**: Ícone verde de check
- 🔴 **Falta**: Ícone vermelho de X  
- 🟡 **Atraso**: Ícone amarelo de relógio
- 🔵 **Observação**: Ícone azul de comentário

### Resumo em Tempo Real
- Contador dinâmico de cada situação
- Chips coloridos com totais parciais
- Atualização automática conforme marcação

### Bordas Dinâmicas
- Cards mudam cor da borda conforme situação selecionada
- Feedback visual imediato para o usuário

## 🚀 Próximas Melhorias

- [ ] Relatórios de frequência por período
- [ ] Notificações automáticas para responsáveis
- [ ] Histórico de chamadas por aluno
- [ ] Exportação de dados para Excel
- [ ] Dashboard com estatísticas de presença
- [ ] Integração WhatsApp para alertas de falta
