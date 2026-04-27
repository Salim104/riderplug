"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { UserFormValues } from "@/lib/validations/user"

export async function getCurrentUser(userId: string) {
  return db.user.findUnique({ where: { id: userId } })
}

export async function updateUserProfile(userId: string, data: UserFormValues) {
  const whatsappNumber = data.whatsappNumber.startsWith("0")
    ? "27" + data.whatsappNumber.slice(1)
    : data.whatsappNumber

  await db.user.update({
    where: { id: userId },
    data: {
      displayName: data.displayName,
      whatsappNumber,
      zone: data.zone,
      ...(data.avatar ? { avatar: data.avatar } : {}),
    },
  })

  revalidatePath("/settings")
}
