# 📱 Íntegracell - Sistema de Ordem de Serviço Online

Sistema completo, moderno e responsivo para assistência técnica de celulares e tablets, com identidade visual da **Íntegracell Reparo de Celular**, integração com WhatsApp, portal online para o cliente acompanhar o reparo, checklist visual de entrada, impressão térmica/A4 e geração de PDF.

---

## 🚀 Funcionalidades Principais

- **Identidade Visual Íntegracell:** Logotipo oficial em vetor 3D, cores azul marinho e laranja técnico de alto contraste.
- **Gestão Completa de OS:** Criação, edição, detalhamento e filtros por status (*Em Análise, Aguardando Aprovação, Na Bancada, Pronta para Retirada, Entregue*).
- **Checklist Técnico Visual:** 16 itens essenciais de teste na entrada (tela, touch, conector de carga, câmeras, biometria, oxidação, etc.).
- **Padrão de Desbloqueio e Senha:** Suporte a PIN numérico e Desenho de Senha (grid 3x3 interativo).
- **Portal Online do Cliente:** Página exclusiva para o cliente acompanhar o status do conserto em tempo real no celular pelo link do WhatsApp ou QR Code.
- **Integração com WhatsApp:** Mensagens automáticas pré-formatadas para *Abertura de OS, Orçamento/Laudo, Pronto para Retirada e Certificado de Garantia*.
- **Impressão e Download de PDF:** Impressão profissional (térmica e folha A4) com QR Code e botão com download automático do arquivo `.pdf` gerado em alta definição (`jsPDF` + `html2canvas`).
- **Backup e Restauração:** Exportação e importação de todo o banco de ordens em arquivo `.json`.
- **Compatível com Hostinger:** Inclui arquivo `.htaccess` otimizado para Single Page Application (SPA), cache e segurança.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** + **TypeScript**
- **Vite 8**
- **Tailwind CSS v4**
- **Lucide Icons**
- **jsPDF & html2canvas** (Download direto de PDF)

---

## 💻 Como Rodar Localmente

1. Clone o repositório ou baixe os arquivos:
```bash
git clone https://github.com/SEU-USUARIO/integracell-os.git
cd integracell-os
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra no navegador:
`http://localhost:3000` ou a porta informada no terminal.

---

## 📦 Como Subir para o GitHub

1. Inicialize o Git na raiz do projeto (caso ainda não esteja inicializado):
```bash
git init
git add .
git commit -m "feat: versao completa da Integracell OS"
git branch -M main
```

2. Adicione o repositório remoto do seu GitHub:
```bash
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
```

3. Envie para o GitHub:
```bash
git push -u origin main
```

---

## 🌐 Como Hospedar na Hostinger

O projeto foi configurado com todas as boas práticas para hospedagem web estática na Hostinger (Hospedagem Compartilhada, Cloud ou VPS):

### Passo 1: Gerar a versão de produção
No seu computador, execute no terminal:
```bash
npm run build
```
Isso criará uma pasta chamada `dist/` com todos os arquivos compilados, minificados e otimizados, incluindo o arquivo `.htaccess`.

### Passo 2: Enviar para a Hostinger
1. Acesse o **hPanel** da Hostinger.
2. Vá em **Gerenciador de Arquivos** (ou conecte via **FTP / FileZilla**).
3. Abra a pasta pública do seu domínio: geralmente chamada **`public_html`**.
4. **IMPORTANTE:** Copie todo o **conteúdo de dentro da pasta `dist/`** e envie diretamente para dentro de `public_html`.
   *(Não suba a pasta `dist` inteira como subpasta, suba os arquivos que estão dentro dela: `index.html`, pasta `assets`, `favicon.svg`, `.htaccess`, etc.)*

### Passo 3: Pronto!
Acesse o seu domínio (ex: `https://seusite.com.br`). O aplicativo carregará instantaneamente com SSL e suporte a todas as funcionalidades!
