# 🔒 LockFi — Cofre com Proteção Contra Saques Arriscados

**LockFi** é um cofre inteligente que adiciona um tempo de espera em saques considerados arriscados, ajudando a evitar perdas rápidas de fundos.

Em vez de permitir que grandes valores saiam instantaneamente, o LockFi cria um período de espera que dá ao usuário tempo para reagir, cancelar o saque ou bloquear o cofre antes que os fundos sejam enviados.

**⭐ Motivação**: Perder fundos instantaneamente não deveria ser o padrão, usuários merecem tempo para reagir.

Projeto desenvolvido para o **Monad Hackathon**.

- **Smart Contract:** [`LockFi.sol`](https://testnet.monadscan.com/address/0x31b36930BdFe07f4366379De4CFeAEF528Ce8e70)
- **Site:** [LockFi DApp](https://lockfi.vercel.app/)

---

## O Problema

Hoje, em cripto:

- Se sua wallet for comprometida → os fundos podem ser drenados instantaneamente
- Se você enviar um valor errado → não há como reverter
- Se alguém tentar sacar tudo → o dinheiro sai na hora

Ou seja:

- Não existe tempo para reagir  
- Não existe proteção intermediária  
- Tudo acontece instantaneamente  

Isso torna qualquer erro ou ataque muito perigoso.

## A Solução — LockFi

O LockFi funciona como um **cofre inteligente**.

Você deposita seus fundos nele.

Quando você tenta sacar:

- 🟢 Saques pequenos → acontecem na hora  
- 🟠 Saques grandes → entram em espera  
- 🔴 Situações suspeitas → entram em espera automaticamente  

Esse tempo cria uma **janela de reação**.

Se algo parecer errado, você pode:

- Cancelar o saque  
- Bloquear o cofre  
- Evitar a perda dos fundos  

## Como Funciona na Prática

### 1 - Depositar

O usuário envia ETH para o cofre:
O valor fica armazenado no contrato.

### 2 - Solicitar Saque

O usuário pede um saque: O contrato avalia se o saque é seguro.

🟢 Saque Seguro

Se o valor for pequeno, executa imediatamente.

🟠 Saque Grande ou Arriscado

Se o valor for mais do que 60% da balança, o saque entra em estado **pendente**.

### 3 - Executar ou Cancelar Saque

Se algo parecer estranho, o usuário pode solicitar o cancelamento imediato do saque e o valor volta para o cofre.

Caso queira continuar com o saque, após aguardar o timer, o valor pode ser enviado.

### 5 -  Bloqueio de Emergência

O usuário pode travar o cofre com o Lock de emergência.

Isso bloqueia saques por 24 horas. Útil em caso de suspeita.

### Regras de Detecção de Risco

Um saque entra em espera se:

#### Regra 1 — Saque Grande

Se o saque for maior que:

60% do saldo do usuário

Exemplo:

- Saldo: 10 ETH
- Saque: 7 ETH

#### Regra 2 — Padrão Suspeito

Se ocorrer um saque pequeno seguido de um saque grande

Exemplo:

- Saque: 0.1 ETH
- Depois: 5 ETH

Isso simula padrões comuns em ataques.

## Por Que Isso Importa?

O LockFi adiciona:

- Tempo para reagir
- Controle do usuário
- Redução de risco

Em vez de:

- Perda instantânea
- Falta de controle
- Nenhuma proteção

Ele mantém a autocustódia, mas com mais segurança prática.

## Principais Funcionalidades

- Cofre de armazenamento em ETH
- Saques instantâneos para valores pequenos
- Saques com atraso para valores grandes
- Cancelamento de saques pendentes
- Bloqueio de emergência
- Detecção simples de risco
- Um saque pendente por usuário

## Visão Geral do Smart Contract

Funções principais:

```solidity
deposit()
withdraw(uint256 amount)
executeWithdraw()
cancelWithdraw()
emergencyLock()
```

## Estrutura de Segurança

Principais proteções:

- Apenas um saque pendente por usuário
- Controle interno de saldo
- Tempo obrigatório para saques arriscados
- Bloqueio manual de emergência
- Estado independente por usuário

## Melhorias Futuras

Ideias para evoluir o projeto:

- Endereço seguro pré-definido
- Integração com hardware wallets/Multi-signature
- Personalização das regras de risco

### Autoria

Leticia Azevedo (Smart Contract)
Shaiane Viana (UI)
