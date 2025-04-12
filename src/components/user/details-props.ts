type InterfaceLinks = {
  handlePerfil: () => void;
}

export const getLinksNavegation = ({ handlePerfil }: InterfaceLinks) => [
  {
    id: 1,
    label: "Minha conta",
    onChange: handlePerfil,
  },
  {
    id: 2,
    label: "Perfis",
    onChange: () => { },
  },
  {
    id: 3,
    label: "Conteúdo e social",
    onChange: () => { },
  },
  {
    id: 4,
    label: "Dados e privacidade",
    onChange: () => { },
  },
  {
    id: 5,
    label: "Central da Familia",
    onChange: () => { },
  },
  {
    id: 6,
    label: "Aplicativos autorizados",
    onChange: () => { },
  },
  {
    id: 7,
    label: "Dispositivos",
    onChange: () => { },
  },
  {
    id: 8,
    label: "Conexões",
    onChange: () => { },
  },
  {
    id: 9,
    label: "Clipes",
    onChange: () => { },
  },
]
