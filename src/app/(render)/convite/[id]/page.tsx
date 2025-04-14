import ConviteClient from "./ConviteClient";
type PageProps = {
  params: {
    id: string;
  }
}

export default function ConviteServer({ params }: PageProps) {
  return <ConviteClient id={params.id} />;
}
