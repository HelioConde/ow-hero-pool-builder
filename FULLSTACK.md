# Arquitetura — OW Hero Pool Builder

## Objetivo do MVP

Validar se um builder pessoal de pool é mais útil que uma lista genérica de heróis.

A primeira versão funciona totalmente no navegador:

- escolhe função;
- considera estilo (dive, brawl, poke);
- considera mecânica preferida;
- considera mobilidade e tipo de mapa;
- aceita prioridades de sobrevivência, utilidade, pressão e peel;
- usa heróis de conforto como possível âncora;
- recomenda três opções com cobertura complementar;
- salva pools localmente.

## Dados

O roster do MVP é deliberadamente curado e não contém estatísticas de balanceamento.

Isso reduz dependência de patch e permite validar a lógica de recomendação. A lista deve ser expandida somente depois que o fluxo principal estiver aprovado.

## Backend futuro

Quando houver necessidade real de conta e histórico, usar a infraestrutura de jogos compartilhada, não o banco geral dos projetos.

Possíveis entidades:

- `ow_pool_profiles`;
- `ow_saved_pools`;
- `ow_hero_preferences`;
- `ow_hero_catalog` versionado por patch.

## QA gates

- nunca recomendar herói de outra função;
- pool deve conter três heróis únicos;
- herói de conforto deve poder virar âncora;
- filtros extremos não podem quebrar a recomendação;
- localStorage corrompido deve cair para lista vazia;
- interface precisa permanecer utilizável no mobile.

## V2

- roster completo e versionado;
- subfunções oficiais;
- filtros por mapa específico;
- aprendizado a partir dos pools salvos;
- explicação de matchups;
- compartilhamento de pool.
