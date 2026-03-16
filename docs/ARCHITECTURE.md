# Architecture

OKX RugShield is a dual-skill onchain defense workflow built on top of OpenClaw and official OKX / OnchainOS skills.

## Layering

### 1. Primitive capability layer
Provided by upstream OKX / OnchainOS skills when available:

- token / market lookup
- wallet portfolio lookup
- route or execution-related capabilities
- other read-only or execution-adjacent onchain primitives

### 2. Workflow layer
Provided by RugShield:

- risk signal interpretation
- Threat Report generation
- wallet exposure mapping
- staged defensive planning
- simulation and audit-oriented output

This separation is intentional.
RugShield does not try to replace OKX primitives. It packages them into a higher-level defense workflow.

## Skill responsibilities

### Scout (`rugshield-scout`)
Input:
- token
- chain
- market or onchain signal context
- mock event replay input

Output:
- structured Threat Report

Primary job:
- identify rug-related signals such as liquidity drop, abnormal volume, dev selling, and smart-money exit

### Guardian (`rugshield-guardian`)
Input:
- Threat Report
- wallet address or portfolio context
- target chains
- operating mode

Output:
- wallet exposure summary
- staged defense plan
- execution conditions
- confirmation requirements

Primary job:
- convert threat context into a wallet-aware defensive response

## Runtime modes

### Demo Mode
Used when:
- official OKX dependencies are missing
- credentials are missing
- judges or reviewers need a fast local walkthrough

Supports:
- mock replay
- mock patrol
- guardian simulation
- benchmark scenarios

### Live Mode
Used when:
- official OKX / OnchainOS skills are installed
- credentials are configured
- environment is correctly prepared

Supports:
- live signal prototype path
- live portfolio prototype path

## Main flow

```text
Signals -> Scout -> Threat Report -> Guardian -> Exposure Check -> Staged Defense Plan
```

Extended view:

```text
[Token / Market / Onchain Inputs]
        -> [Scout]
        -> [Threat Report]
        -> [Guardian]
        + [Wallet Portfolio]
        -> [Risk Prioritization]
        -> [Staged Exit / Defense Plan]
        -> [Simulation / Conditional Action]
```

## Design choices

### Graceful downgrade
If upstream OKX dependencies are unavailable, the project should not become unusable.
Instead it should:
- warn clearly
- continue in demo or analysis mode when possible
- only claim live capability when the environment truly supports it

### Auditability
Outputs should remain explainable and structured:
- risk level
- confidence
- exposed positions
- staged plan
- execution condition
- confirmation requirement

### Contest fit
The repository is designed to be:
- demo-first
- benchmarkable
- understandable by judges without a perfect live environment
