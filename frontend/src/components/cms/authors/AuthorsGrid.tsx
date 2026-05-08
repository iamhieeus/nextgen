import AuthorCard from "@/components/cms/authors/AuthorCard"
import type { AuthorRow } from "@/components/cms/authors/types"

interface AuthorsGridProps {
  authors:  AuthorRow[]
  onEdit:   (id: number) => void
  onDelete: (author: AuthorRow) => void
  onStories:(id: number) => void
}

export default function AuthorsGrid({ authors, onEdit, onDelete, onStories }: AuthorsGridProps) {
  if (!authors.length) {
    return (
      <div className="text-center py-[60px] text-[#aaa]">
        <div className="text-[42px] mb-3">✍️</div>
        <p className="text-[14px]">Không tìm thấy tác giả nào</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-3.5">
      {authors.map(a => (
        <AuthorCard
          key={a.id}
          author={a}
          onEdit={onEdit}
          onDelete={onDelete}
          onStories={onStories}
        />
      ))}
    </div>
  )
}
