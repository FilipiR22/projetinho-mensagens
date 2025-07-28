# projetinho-mensagens

API para cadastro de usuários, autenticação, mensagens e comentários, com gerenciamento por administrador.

---

## Como usar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Inicie o servidor:
   ```bash
   node server.js
   ```

---

## Autenticação

- Use o token JWT retornado no login em todas as rotas protegidas:
  ```
  Authorization: Bearer SEU_TOKEN_JWT
  ```

---

## Rotas da API

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

---

### 2. Login

- **POST** `/login`
- **Body:**
  ```json
  {
    "email": "joao@email.com",
    "senha": "123456"
  }
  ```
- **Resposta:**  
  ```json
  {
    "token": "SEU_TOKEN_JWT"
  }
  ```

---

### 3. Mensagens

#### Criar mensagem

- **POST** `/mensagens`
- **Headers:**  
  `Authorization: Bearer SEU_TOKEN_JWT`
- **Body:**
  ```json
  {
    "conteudo": "Olá, mundo!"
  }
  ```

#### Listar mensagens

- **GET** `/mensagens`
- **Headers:**  
  `Authorization: Bearer SEU_TOKEN_JWT`
- **Descrição:**  
  - Usuário comum vê apenas suas mensagens.
  - Admin vê todas as mensagens.

#### Buscar mensagem específica

- **GET** `/mensagens/{id}`
- **Headers:**  
  `Authorization: Bearer SEU_TOKEN_JWT`

#### Atualizar mensagem

- **PUT** `/mensagens/{id}`
- **Headers:**  
  `Authorization: Bearer SEU_TOKEN_JWT`
- **Body:**
  ```json
  {
    "conteudo": "Novo conteúdo"
  }
  ```
- **Descrição:**  
  - Usuário comum só pode atualizar suas mensagens.
  - Admin pode atualizar qualquer mensagem.

#### Deletar mensagem

- **DELETE** `/mensagens/{id}`
- **Headers:**  
  `Authorization: Bearer SEU_TOKEN_JWT`
- **Descrição:**  
  - Usuário comum só pode deletar suas mensagens.
  - Admin pode deletar qualquer mensagem.

---

### 4. Comentários

#### Adicionar comentário a uma mensagem

- **POST** `/mensagens/{idmensagem}/comentarios`
- **Headers:**  
  `Authorization: Bearer SEU_TOKEN_JWT`
- **Body:**
  ```json
  {
    "conteudo": "Comentário legal!"
  }
  ```

#### Listar comentários de uma mensagem

- **GET** `/mensagens/{idmensagem}/comentarios`
- **Headers:**  
  `Authorization: Bearer SEU_TOKEN_JWT`
- **Descrição:**  
  - Usuário comum vê comentários da mensagem.
  - Admin pode ver todos os comentários.

#### Atualizar comentário

- **PUT** `/mensagens/{idmensagem}/comentarios/{idComentario}`
- **Headers:**  
  `Authorization: Bearer SEU_TOKEN_JWT`
- **Body:**
  ```json
  {
    "conteudo": "Comentário editado pelo usuário ou admin"
  }
  ```
- **Descrição:**  
  - Usuário comum só pode editar seus comentários.
  - Admin pode editar qualquer comentário.

#### Deletar comentário

- **DELETE** `/mensagens/{idmensagem}/comentarios/{idComentario}`
- **Headers:**  
  `Authorization: Bearer SEU_TOKEN_JWT`
- **Descrição:**  
  - Usuário comum só pode deletar seus comentários.
  - Admin pode deletar qualquer comentário.

---

## Como usar o Refresh Token

### 1. Login

Ao fazer login em `/login`, você receberá dois tokens:

```json
{
  "token": "SEU_ACCESS_TOKEN",
  "refreshToken": "SEU_REFRESH_TOKEN"
}
```

- Use o `token` (access token) no header `Authorization` para acessar as rotas protegidas.
- Guarde o `refreshToken` para renovar seu access token quando ele expirar.

---

### 2. Renovar o Access Token

Quando o access token expirar, faça uma requisição:

- **POST** `/login/refresh`
- **Body:**
  ```json
  {
    "refreshToken": "SEU_REFRESH_TOKEN"
  }
  ```
- **Resposta:**
  ```json
  {
    "token": "NOVO_ACCESS_TOKEN"
  }
  ```

Use o novo access token retornado para continuar acessando as rotas protegidas.

---

**Importante:**  
- O refresh token também expira (veja o tempo em `.env`).
- Se o refresh token expirar ou for inválido, será necessário fazer login novamente.

---

## Observações

- Todas as rotas de mensagens e comentários exigem autenticação via JWT.
- O campo `perfil` define se o usuário é `USER` ou `ADMIN`.
- O admin tem permissões totais sobre mensagens e comentários.