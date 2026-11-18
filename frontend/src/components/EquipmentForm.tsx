"use client";

import { useState, type FormEvent } from "react";
import type { EquipmentInput } from "../../interface";
import { errorMessage } from "@/libs/api";
import { ErrorMessage } from "@/components/Feedback";
import EquipmentImage from "@/components/EquipmentImage";
import { imageUrlError, isGoogleDriveUrl } from "@/libs/image-url";

export default function EquipmentForm({ initialValues, onSubmit, submitLabel }: {
  initialValues?: EquipmentInput;
  onSubmit: (input: EquipmentInput) => Promise<void>;
  submitLabel: string;
}) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [quantity, setQuantity] = useState(String(initialValues?.quantity ?? ""));
  const [rentalRate, setRentalRate] = useState(String(initialValues?.rentalRate ?? ""));
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? "");
  const [checkedImage, setCheckedImage] = useState<{ url: string; status: "loaded" | "error" } | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const image = imageUrl.trim();
  const urlError = imageUrlError(image);
  const imageStatus = checkedImage?.url === image ? checkedImage.status : "loading";
  const imageFailure = isGoogleDriveUrl(image)
    ? "The image could not be loaded. In Google Drive, set General access to Anyone with the link and Viewer, and use a file link rather than a folder. You can also leave Image URL blank."
    : "The image could not be loaded. Use a direct image link or leave Image URL blank.";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = { name: name.trim(), category: category.trim(), description: description.trim(), quantity: Number(quantity), rentalRate: Number(rentalRate), imageUrl: image };
    if (!values.name || !values.category || !values.description || quantity === "" || rentalRate === "" || !Number.isInteger(values.quantity) || values.quantity < 0 || !Number.isFinite(values.rentalRate) || values.rentalRate < 0) {
      setError("Complete all fields. Quantity must be a nonnegative whole number and rental rate must be nonnegative.");
      return;
    }
    if (urlError || (image && imageStatus !== "loaded")) {
      setError(urlError ?? (imageStatus === "error" ? imageFailure : "The image is still loading. Wait for the preview or leave Image URL blank."));
      return;
    }
    setPending(true);
    setError("");
    try { await onSubmit(values); }
    catch (cause) { setError(errorMessage(cause)); }
    finally { setPending(false); }
  }

  return <form className="form-stack" onSubmit={submit}>
    {error && <ErrorMessage>{error}</ErrorMessage>}
    <label className="field"><span>Name</span><input disabled={pending} onChange={(event) => setName(event.target.value)} required value={name} /></label>
    <label className="field"><span>Category</span><input disabled={pending} onChange={(event) => setCategory(event.target.value)} required value={category} /></label>
    <div className="field"><label htmlFor="equipment-description">Description</label><textarea disabled={pending} id="equipment-description" onChange={(event) => setDescription(event.target.value)} required rows={4} value={description} /></div>
    <div className="field">
      <label htmlFor="equipment-image-url">Image URL (optional)</label>
      <input aria-describedby="equipment-image-help" disabled={pending} id="equipment-image-url" maxLength={2048} onChange={(event) => setImageUrl(event.target.value)} type="url" value={imageUrl} />
      <p className="field-help" id="equipment-image-help">Use a direct HTTP(S) image URL or a Google Drive file link. For Drive, set General access to Anyone with the link (Viewer). Leave blank for no image.</p>
      {urlError && <p className="field-error">{urlError}</p>}
      {image && !urlError && <EquipmentImage key={image} loading="eager" name={name.trim() || "Equipment preview"} onStatusChange={(status) => setCheckedImage({ url: image, status })} src={image} />}
      {image && !urlError && imageStatus === "loaded" && <p className="field-help">Image preview loaded.</p>}
      {image && !urlError && imageStatus === "error" && <p className="field-error">{imageFailure}</p>}
    </div>
    <label className="field"><span>Quantity</span><input disabled={pending} min={0} onChange={(event) => setQuantity(event.target.value)} required step={1} type="number" value={quantity} /></label>
    <label className="field"><span>Rental Rate</span><input disabled={pending} min={0} onChange={(event) => setRentalRate(event.target.value)} required step="any" type="number" value={rentalRate} /></label>
    <button className="button button-primary" disabled={pending} type="submit">{pending ? "Saving…" : submitLabel}</button>
  </form>;
}
