# Discord Clone - Next.js 15+

<p align="center">
  <img src="https://k75mjkjgco.ufs.sh/f/wiGIa3OsPCpWea8FORzpiwLd4IDv86s15lEKZqNb7tgaA2Fj" alt="Preview">
</p>

Um clone completo do Discord com frontend moderno (Next.js 15+) e backend robusto, replicando as principais funcionalidades da plataforma.

## 🌟 Recursos

### � Autenticação

- Login com Clerk Auth (SSO, E-mail, Google, GitHub)
- Gerenciamento de perfis de usuário
- Sessões seguras

### 🖥️ Servidores

- Criação/edição de servidores
- Sistema de convites (URL única)
- Personalização (nome, ícone, banner)
- Controle de membros (kick/ban)

### 💬 Chat

- Canais de texto e voz
- Mensagens em tempo real
- Markdown básico (negrito, itálico, código)
- Upload de arquivos (imagens, documentos)

### 👥 Usuários

- Lista de membros online
- Chat privado (DM)
- Status personalizável
- Sistema de amigos

## 🛠️ Tecnologias

### Frontend

- **Next.js 15+** (App Router)
- **TypeScript**
- **Tailwind CSS** + Shadcn/ui
- **Socket.io Client** (chat em tempo real)
- **React Hook Form** + **Zod** (validação)
- **UploadThing** (upload de arquivos)

### Backend

- **[Node.js](https://github.com/glopmts/backend-discord-chat)**
- **Prisma** (ORM)
- **PostgreSQL** (banco de dados)
- **Socket.io** (WebSockets)
- **Clerk Auth** (autenticação)

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Conta no [Clerk](https://clerk.dev)

### Frontend

```bash
# Clone o repositório
git clone https://github.com/glopmts/discord-clone.git
cd discord-clone

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Preencha com suas credenciais

# Inicie o servidor
npm run dev
```
