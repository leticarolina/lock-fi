# 🔒 LockFi — Protocolo de Segurança para Cofres Inteligentes

**LockFi** é um cofre self-custody que protege seus fundos contra drenagem instantânea através de detecção comportamental de saques.

Em vez de permitir que os fundos saiam imediatamente, o LockFi avalia cada tentativa de saque contra um conjunto de regras projetadas para detectar padrões reais de ataque. Saques suspeitos são atrasados — não bloqueados — dando a você uma janela de reação para cancelar, travar o cofre ou mover seus fundos para um endereço seguro pré-cadastrado.

> **A Visão:** Drenagem instantânea de fundos não deveria ser o padrão da indústria. Usuários merecem uma janela de tempo para reagir a ameaças.

🏆 **1º Lugar — Monad Hackathon**

- **Smart Contract:** [`LockFi.sol`](https://testnet.monadscan.com/address/0x0919Df3678039BCe59abdD19D7bf9e7D1b7eb5d8)
- **Demo ao Vivo:** [lock-fi.vercel.app](https://lock-fi.vercel.app/)
- **Design de Segurança:** [`SECURITY.md`](./SECURITY.md)

---

## O Problema

No ecossistema cripto hoje:

- **Carteira comprometida** → fundos drenados em segundos, sem recurso.
- **Erro de digitação** → transação enviada, não há nada que você possa fazer.
- **Ataque de drenagem lenta** → atacante extrai aos poucos, passando despercebido.
- **Sequestro de endereço seguro** → atacante redireciona seu endereço de recuperação antes que você perceba.

Tudo acontece na velocidade do blockchain. Um erro ou uma chave comprometida, e acabou.

---

## A Solução

O LockFi fica entre seus fundos e o mundo externo. Cada saque é avaliado antes de ser executado.

**🟢 Valor pequeno e normal** — executado instantaneamente.  
**🟠 Valor grande ou suspeito** — entra na fila pendente com atraso de 12h.  
**🟠 Qualquer saque após uma sondagem** — sinalizado pela detecção de padrão, atraso de 12h.  
**🟠 Drenagem acumulada em 72h** — sinalizado pelo monitoramento de janela de tempo, atraso de 12h.

Se algo parecer errado, você tem tempo para agir:

1. **Cancelar** o saque pendente — os fundos retornam ao cofre imediatamente.
2. **Travar o cofre** — congela toda a atividade de saída por até 30 dias.
3. **Sacar para endereço seguro** — envia tudo para um endereço de confiança pré-cadastrado.

---

## Regras de Detecção de Risco

### Regra 1 — Saque Grande

**Gatilho:** Saque ultrapassa 60% do saldo do cofre.

```
Saldo: 10 ETH
Saque: 7 ETH (70%) → Sinalizado, atraso de 12h
```

Defende contra drenagem instantânea do saldo total após comprometimento da carteira.

---

### Regra 2 — Padrão de Sondagem (Test-Probe)

**Gatilho:** O saque anterior foi menor que 5% do saldo.

```
Saque 1: 0.04 ETH (4%) → Executado instantaneamente
Saque 2: Qualquer valor → Sinalizado, atraso de 12h
```

Defende contra ataques em estágios, onde o atacante primeiro envia uma pequena transação de "teste" para verificar o acesso à carteira antes de tentar uma drenagem maior.

---

### Regra 3 — Janela de Tempo Cumulativa

**Gatilho:** Total de saques nas últimas 72 horas ultrapassa 30% do saldo.

```
Saldo: 10 ETH
Saque 1: 10% → OK
Saque 2: 10% → OK
Saque 3: 11% → Sinalizado (acumulado > 30%)
```

Defende contra ataques de drenagem lenta, onde o atacante extrai gradualmente para evitar acionar a Regra 1.

---

## Funcionalidades Principais

### Ciclo de Vida do Saque

- Cada saque é executado instantaneamente ou entra em uma **fila pendente de 12 horas**.
- Apenas **um saque pendente** por usuário — impede spam para esgotar o mecanismo de atraso.
- Saques pendentes podem ser **cancelados a qualquer momento**, retornando os fundos ao cofre imediatamente.

### Bloqueio de Emergência

- Congela toda atividade do cofre por uma **duração definida pelo usuário** (1 hora a 30 dias).
- O bloqueio só pode ser **estendido, nunca reduzido** — um atacante não pode diminuir o tempo de bloqueio para recuperar acesso mais cedo.
- Bloqueia todos os saques, execuções pendentes e alterações de endereço seguro enquanto ativo.

### Recuperação por Endereço Seguro

- Cadastre um **endereço de recuperação confiável** como caminho de saída permanente.
- Alterar o endereço seguro exige um **atraso de 24 horas** — impede que atacantes o redirecionem antes que você possa reagir.
- Alterações no endereço seguro são **bloqueadas durante o bloqueio de emergência**.
- `withdrawToSafe` envia o saldo total para o endereço seguro em uma única transação.

---

## Como Funciona

**Fluxo normal de saque:**

1. Usuário deposita ETH no cofre
2. Usuário solicita um saque
3. LockFi avalia o risco — instantâneo se seguro, fila de 12h se suspeito
4. Se pendente: usuário aguarda e executa, ou cancela imediatamente se não foi ele

**Se o cofre estiver em risco:**

1. Detectar atividade suspeita
2. Acionar bloqueio de emergência (1 hora a 30 dias — nada se move)
3. Cancelar qualquer saque pendente criado pelo atacante
4. Aguardar o bloqueio expirar
5. Sacar tudo para o endereço seguro pré-cadastrado

---

## Funções do Smart Contract

```solidity
// Cofre principal
deposit()                              // Depositar token nativo
withdraw(uint256 amount)               // Iniciar saque — instantâneo ou atrasado
executeWithdraw()                      // Executar após o atraso expirar
cancelWithdraw()                       // Cancelar saque pendente

// Emergência
emergencyLock(uint256 duration)        // Travar cofre (1h a 30 dias)

// Endereço seguro
setSafeAddress(address _safe)          // Cadastrar endereço de recuperação (primeira vez)
requestSafeAddressChange(address)      // Solicitar alteração (atraso de 24h)
confirmSafeAddressChange()             // Confirmar após atraso
cancelSafeAddressChange()              // Cancelar alteração pendente
withdrawToSafe()                       // Enviar saldo total ao endereço seguro

// Helpers de visualização
getUserState(address)                  // Estado completo do cofre em uma chamada
getInstantWithdrawLimit(address)       // Valor máximo que executa instantaneamente
getRemainingPendingTime(address)       // Tempo restante no saque pendente
getRemainingLockTime(address)          // Tempo restante no bloqueio de emergência
```

---

## Arquitetura de Segurança

- **ReentrancyGuard** em todas as funções que transferem ETH.
- **Padrão Checks-Effects-Interactions** — saldo deduzido antes do ETH ser enviado.
- **Isolamento de estado por usuário** — sem pools compartilhados, sem risco cruzado entre usuários.
- **Bloqueio somente extensível** — `lockedUntil` só pode avançar no tempo, nunca retroceder.
- **Detecção comportamental** — regras de risco operam sobre histórico de padrões, não apenas valores individuais.

Para rationale completo de design, modelo de ameaças e orientações de auditoria, veja [`SECURITY.md`](./SECURITY.md).

---

## Testes

A cobertura de testes inclui testes unitários para todas as funções e casos extremos, além de testes de invariante que verificam solvência, integridade de saldo e consistência de estado sob sequências arbitrárias de chamadas.

---

## Limitações Conhecidas

- Apenas token nativo (ETH / MON). Suporte a ERC-20 está planejado.
- Thresholds de regras são constantes hardcoded. Thresholds configuráveis são uma consideração futura.
- `lastWithdrawPercent` (detecção de sondagem da Regra 2) persiste indefinidamente. Um usuário que fez um saque pequeno terá o próximo saque atrasado independentemente do tempo passado. O mecanismo de cancelamento mitiga isso.

### Suporte a NFTs *(em breve na V3)*

- Deposite e proteja NFTs ERC-721 dentro do cofre.
- Todos os saques de NFTs seguem um atraso fixo de 12 horas — sem exceções.
- NFTs de alto valor merecem a mesma janela de reação que seus fundos.

---

## Stack

- **Smart Contract:** Solidity 0.8.20, Foundry, OpenZeppelin
- **Frontend:** React, wagmi, RainbowKit, Next.js
- **Rede:** Monad Testnet

---

## Autoria

**Leticia Azevedo** — Arquitetura de Smart Contract & Dev Principal  
**Shaiane Viana** — Design UI/UX

Feito com 💜 para o ecossistema Monad.
