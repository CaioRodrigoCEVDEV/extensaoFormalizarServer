# extensaoFormalizarServer

## Rate limit

Valores padrao:

- API geral: 100 requisicoes a cada 15 minutos por IP.
- Rota `/rewrite`: 20 requisicoes a cada 15 minutos por IP.

Variaveis opcionais:

```env
RATE_LIMIT_WINDOW_MINUTES=15
RATE_LIMIT_MAX_REQUESTS=100
REWRITE_RATE_LIMIT_WINDOW_MINUTES=15
REWRITE_RATE_LIMIT_MAX_REQUESTS=20
TRUST_PROXY=1
```
