"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import Editor from "@/components/editor";
import { useGenerateUploadUrl } from "../upload/api/use-generate-upload-url"; // ✅ your custom hook

interface Props {
  workspaceId: Id<"workspaces">;
  userId: Id<"users">;
}

export default function CreateAnnouncementForm({ workspaceId, userId }: Props) {
  const create = useMutation(api.announcements.createAnnouncement);
  const { mutate: generateUploadUrl } = useGenerateUploadUrl(); // ✅ use your hook
  const [title, setTitle] = useState("");

  const uploadImage = async (file: File) => {
    const postUrl = await generateUploadUrl({});
    if (!postUrl) throw new Error("Upload URL could not be generated.");
    
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(postUrl, {
      method: "POST",
      body: formData,
    });
    const { storageId } = await res.json();
    return storageId as Id<"_storage">;
  };

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    if (!title.trim()) return;

    let imageId: Id<"_storage"> | undefined = undefined;
    if (image) {
      imageId = await uploadImage(image);
    }

    await create({
      title,
      body,
      image: imageId,
      workspaceId,
      createdBy: userId,
      createdAt: Date.now(),
    });

    setTitle("");
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-white shadow-sm max-w-3xl mx-auto">
      <Input
        placeholder="Announcement title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Editor onSubmit={handleSubmit} variant="create" />
    </div>
  );
}