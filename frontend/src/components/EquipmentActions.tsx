import Link from "next/link";
import type { Role } from "../../interface";
import EquipmentDeleteControl from "@/components/EquipmentDeleteControl";

// Labels, links, and role variants render on the server. Only deletion needs
// browser state, the live session token, and a confirmation dialog.
export default function EquipmentActions({ equipmentId, role, variant }: {
  equipmentId: string;
  role: Role | null;
  variant: "catalog" | "detail";
}) {
  if (role === "admin") {
    return <div className="button-row">
      {variant === "catalog" && <Link className="button button-outline" href={`/equipments/${equipmentId}`}>View</Link>}
      <Link className="button button-outline" href={`/equipments/${equipmentId}/edit`}>Edit</Link>
      <EquipmentDeleteControl equipmentId={equipmentId} stayOnList={variant === "catalog"} />
    </div>;
  }
  if (role === "member") {
    return <Link className={`button ${variant === "detail" ? "button-primary" : "button-outline"}`} href={`/equipments/${equipmentId}/rent`}>Rent</Link>;
  }
  return variant === "detail"
    ? <Link className="button button-outline" href="/login">Login to request</Link>
    : null;
}
