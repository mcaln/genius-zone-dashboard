# Genius Zone Dashboard

Dashboard psicométrico que analisa documentos de autoconhecimento usando 7 frameworks científicos convergentes, powered by Claude AI.

## Frameworks

1. **Gay Hendricks** — Zonas de Genialidade/Excelência/Competência/Incompetência
2. **CliftonStrengths (Don Clifton)** — Top 5 talentos dominantes
3. **Kolbe A (Kathy Kolbe)** — 4 instintos conativos
4. **Equação de Valor (Alex Hormozi)** — Resultado × Probabilidade ÷ (Tempo × Esforço)
5. **Wealth Dynamics (Roger Hamilton)** — Perfil de geração de riqueza
6. **Fascination Advantage (Sally Hogshead)** — Arquétipo de fascinação
7. **Unique Ability (Dan Sullivan)** — Habilidade única e alinhamento

## Como funciona

1. Faça upload de um documento (.pdf, .md, .txt) com dados de autoconhecimento
2. O Claude Sonnet analisa o documento e extrai/infere dados dos 7 frameworks
3. O dashboard renderiza cards interativos com charts (radar, bar)
4. A Aurora (chat AI) responde perguntas sobre seu perfil usando Claude Haiku

## Deploy rápido (Vercel)

```bash
# 1. Clone o repositório
git clone https://github.com/jcarlosamorim/genius-zone-dashboard.git
cd genius-zone-dashboard

# 2. Configure a env var obrigatória
#    No Vercel Dashboard > Settings > Environment Variables:
#    ANTHROPIC_API_KEY = sua-chave-anthropic

# 3. Deploy
vercel deploy --prod
```

## Variáveis de Ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `ANTHROPIC_API_KEY` | Sim | Chave da API Anthropic (Claude) |
| `SUPABASE_URL` | Não | URL do projeto Supabase (habilita auth + persistência) |
| `SUPABASE_ANON_KEY` | Não | Chave anônima do Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Não | Chave service role (quotas, token logging) |

**Sem Supabase:** funciona 100% com localStorage (dados ficam no navegador).
**Com Supabase:** adiciona autenticação, persistência cross-device e quotas.

## Estrutura

```
├── index.html              # Dashboard standalone (HTML + CSS + boot script)
├── js/
│   ├── auth-optional.js    # Auth module (anonymous UUID via localStorage)
│   ├── psicometria-upload.js  # Upload handler (PDF/MD/TXT → API)
│   ├── psicometria-renderer.js # Renderiza 7 cards com Chart.js
│   └── aurora.js           # Chat AI flutuante
├── css/
│   ├── tokens.css          # Design tokens (dark/light)
│   └── aurora.css          # Estilos do chat Aurora
├── api/
│   ├── analyze.js          # POST /api/analyze — Claude Sonnet (structured output)
│   ├── aurora.js           # POST /api/aurora — Claude Haiku (chat)
│   └── _shared/            # Auth guard, rate limiter, quota, logger
├── supabase/
│   └── migrations/         # SQL para criar tabela student_psicometria
└── vercel.json             # Config de deploy
```

## Licença

MIT
