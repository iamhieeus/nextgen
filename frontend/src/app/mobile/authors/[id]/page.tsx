import { notFound } from "next/navigation"
import { getAuthorDetail } from "@/services/author.service"
import AuthorClient from "./AuthorClient"

export default async function AuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const author = await getAuthorDetail(parseInt(id, 10))
  if (!author) notFound()
  return <AuthorClient author={author} />
}
