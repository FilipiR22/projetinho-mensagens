# projetinho-mensagens

API para cadastro de usuários, autenticação, mensagens e comentários, com gerenciamento por administrador.

---

## Requisitos

- Node.js 20+
- npm

---

## Instalação

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor:
   ```bash
   npm run dev
   ```

---

## Comandos de rebuild

Se precisar reconstruir o projeto (por exemplo, após instalar novas dependências nativas ou alterar arquivos de build), utilize um dos comandos abaixo conforme seu sistema operacional:

### Linux

```bash
npm run rebuild:linux
```

### Windows

```powershell
npm run rebuild:win
```

Esses comandos vão limpar o cache, remover dependências antigas e reinstalar tudo do zero, além de iniciar o servidor automaticamente.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo (ajuste se necessário):

```
JWT_SECRET=senha
JWT_EXPIRES_IN=30m
JWT_REFRESH_EXPIRES_IN=15d
```

---

## Testando a API

Você pode testar a API usando ferramentas como [Postman](https://www.postman.com/) ou [Insomnia](https://insomnia.rest/), ou ainda via `curl` no terminal.

### 1. Cadastro de Usuário

- **POST** `/usuario`
- **Body:**
  ```json
  {
    "nome": "João",
    "email": "joao@email.com",
    "senha": "123456"
  }
  ```
- **Resposta esperada:** 201 Created
  ```json
  {
    "id": 1,
    "nome": "João",
    "email": "joao@email.com",
    "perfil": "USER"
  }
  ```

### 2. Login

- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "joao@email.com",
    "senha": "123456"
  }
  ```
- **Resposta esperada:** 200 OK
  ```json
  {
    "token": "SEU_TOKEN_JWT",
    "refreshToken": "SEU_REFRESH_TOKEN"
  }
  ```

Use o token JWT retornado no login em todas as rotas protegidas:
```
Authorization: Bearer SEU_TOKEN_JWT
```

### 3. Refresh Token

- **POST** `/auth/refresh`
- **Body:**
  ```json
  {
    "refreshToken": "SEU_REFRESH_TOKEN"
  }
  ```
- **Resposta esperada:** 200 OK
  ```json
  {
    "token": "NOVO_ACCESS_TOKEN"
  }
  ```

---

## Rotas de Usuário

- **GET** `/usuario`  
  Lista todos os usuários.  
  **Resposta:** 200 OK

- **GET** `/usuario/{id}`  
  Busca usuário por ID.  
  **Resposta:** 200 OK ou 404 se não encontrado.

- **PUT** `/usuario/{id}`  
  Atualiza nome/email do usuário.  
  **Body:**
  ```json
  {
    "nome": "Novo Nome",
    "email": "novo@email.com"
  }
  ```
  **Resposta:** 200 OK

- **DELETE** `/usuario/{id}`  
  Remove usuário.  
  **Resposta:** 204 No Content

---

## Rotas de Mensagens

- **POST** `/mensagens`  
  Cria mensagem (autenticado).  
  **Body:**
  ```json
  {
    "titulo": "Título",
    "conteudo": "Conteúdo da mensagem"
  }
  ```
  **Resposta:** 201 Created

- **GET** `/mensagens`  
  Lista mensagens do usuário (ou todas, se admin).  
  **Resposta:** 200 OK

- **GET** `/mensagens/{id}`  
  Busca mensagem específica.  
  **Resposta:** 200 OK ou 404

- **PUT** `/mensagens/{id}`  
  Atualiza mensagem (dono ou admin).  
  **Body:**
  ```json
  {
    "conteudo": "Novo conteúdo"
  }
  ```
  **Resposta:** 200 OK

- **PATCH** `/mensagens/{id}`  
  Atualiza parcialmente mensagem.  
  **Body:**  
  ```json
  {
    "titulo": "Novo título"
  }
  ```
  **Resposta:** 200 OK

- **DELETE** `/mensagens/{id}`  
  Remove mensagem (dono ou admin).  
  **Resposta:** 204 No Content

---

## Rotas de Comentários

- **POST** `/mensagens/{idmensagem}/comentarios`  
  Adiciona comentário a uma mensagem.  
  **Body:**
  ```json
  {
    "conteudo": "Comentário legal!"
  }
  ```
  **Resposta:** 201 Created

- **GET** `/mensagens/{idmensagem}/comentarios`  
  Lista comentários da mensagem.  
  **Resposta:** 200 OK

- **PUT** `/mensagens/{idmensagem}/comentarios/{idComentario}`  
  Atualiza comentário (dono ou admin).  
  **Body:**
  ```json
  {
    "conteudo": "Comentário editado"
  }
  ```
  **Resposta:** 200 OK

- **DELETE** `/mensagens/{idmensagem}/comentarios/{idComentario}`  
  Remove comentário (dono ou admin).  
  **Resposta:** 204 No Content

---

## Códigos de resposta e exemplos de erro

| Código | Situação                | Exemplo de resposta                                 |
|--------|------------------------|-----------------------------------------------------|
| 401    | Não autenticado        | `{"error": "Token JWT ausente ou inválido"}`        |
| 403    | Acesso não permitido   | `{"error": "Você não tem permissão para isso"}`     |
| 404    | Recurso não encontrado | `{"error": "Mensagem/Comentário não encontrado"}`   |
| 422    | Falha de validação     | `{"errors": {"campo": ["Campo obrigatório."]}}`     |
| 201    | Criado                 | Recurso criado (ver exemplos acima)                 |
| 200    | OK                     | Recurso retornado/atualizado                        |
| 204    | No Content             | Recurso removido, sem corpo de resposta             |

---

## Dicas para testar

- Sempre envie o header `Authorization: Bearer SEU_TOKEN_JWT` nas rotas protegidas.
- Use o refresh token para renovar o access token antes de expirar.
- Teste todos os fluxos: cadastro, login, criação, edição, deleção e listagem.
- Para testar como admin, crie um usuário com perfil `ADMIN` (ajuste manualmente no banco ou use um endpoint/admin script).

---

## Observações

- O campo `perfil` define se o usuário é `USER` ou `ADMIN`.
- O admin tem permissões totais sobre mensagens e comentários.
- O refresh token também expira (veja o tempo em `.env`).
- Se o refresh token expirar ou for inválido, será necessário fazer login novamente.

---

## Exemplo de uso com  

```bash
# Cadastro de usuário
curl -X POST http://localhost:3000/usuario -H "Content-Type: application/json" -d '{"nome":"João","email":"joao@email.com","senha":"123456"}'

# Login
curl -X POST http://localhost:3000/auth/login -H "Content-Type: application/json" -d '{"email":"joao@email.com","senha":"123456"}'

# Criar mensagem
curl -X POST http://localhost:3000/mensagens -H "Authorization: Bearer SEU_TOKEN_JWT" -H "Content-Type: application/json" -d '{"titulo":"Oi","conteudo":"Primeira mensagem"}'
```

---

Pronto! Agora você tem tudo para testar todas as funcionalidades da API.
