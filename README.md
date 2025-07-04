# projetinho-mensagens

API para cadastro de usuários, autenticação, mensagens e comentários.

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
- Use o token JWT nas próximas requisições protegidas, no header:
  ```
  Authorization: Bearer SEU_TOKEN_JWT
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
    "titulo": "Primeira mensagem",
    "conteudo": "Olá, mundo!"
  }
  ```

#### Listar mensagens

- **GET** `/mensagens`
- **Headers:**  
  `Authorization: Bearer SEU_TOKEN_JWT`

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
    "titulo": "Novo título",
    "conteudo": "Novo conteúdo"
  }
  ```

#### Deletar mensagem

- **DELETE** `/mensagens/{id}`
- **Headers:**  
  `Authorization: Bearer SEU_TOKEN_JWT`

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

---

## Observações

- Todas as rotas de mensagens e comentários exigem autenticação via JWT.
- Use o Postman ou outro cliente HTTP para testar as rotas.
- Não há front-end, apenas API