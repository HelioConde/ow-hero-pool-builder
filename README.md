<div align="center">
  <h1>🛡️ OW Hero Pool Builder</h1>
  <p><strong>Monte um trio de heróis complementar para estudar funções e estilos de jogo em Overwatch.</strong></p>
  <p><img alt="Status" src="https://img.shields.io/badge/status-MVP%20experimental-64748b"></p>
</div>

## Como funciona

Escolha uma função (**Tank, Dano ou Suporte**), indique como gosta de jogar e examine a sugestão de três heróis com papéis complementares:

**Âncora** — escolha principal.  
**Complemento** — alternativa para outras situações.  
**Cobertura** — opção para necessidades não atendidas pelas primeiras escolhas.

## Preferências consideradas

| Categoria | Opções |
| --- | --- |
| Estilo | Dive, Brawl e Poke |
| Mecânica | Hitscan, tracking, projéteis ou curta distância |
| Jogo | Mobilidade e tipo de mapa |
| Prioridade | Utilidade, sobrevivência, pressão e peel |
| Preferência pessoal | Heróis de conforto |

O algoritmo explica a recomendação e mostra a cobertura coletiva. Os pools escolhidos podem ser salvos em `localStorage`.

**Atenção:** o roster é uma **amostra curada para validar a ideia**. Não é uma tier list, não utiliza win rate atual nem acompanha automaticamente os patches do Overwatch.

## Executar localmente

```bash
git clone https://github.com/HelioConde/ow-hero-pool-builder.git
cd ow-hero-pool-builder
python -m http.server 8000
```

Abra `http://localhost:8000`.

`app.js` implementa a interface, `core.js` concentra a lógica e `tests/` reúne testes do projeto. O comando `npm run screenshots` gera capturas quando o ambiente está preparado.

## Próximos passos

Validar se o trio realmente ajuda jogadores a escolher um pool, atualizar o roster quando necessário e revisar responsividade/acessibilidade. A expansão deve depender de feedback, não apenas de mais opções.

Projeto independente, não oficial. Criado por [Hélio Conde](https://github.com/HelioConde).
