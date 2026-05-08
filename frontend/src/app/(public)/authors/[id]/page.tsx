import { notFound } from "next/navigation"
import Link from "next/link"
import AuthorHero from "@/components/author/AuthorHero"
import AuthorWorksList from "@/components/author/AuthorWorksList"
import { getAuthorDetail } from "@/services/author.service"
import { prisma } from "@/lib/prisma"
import type { Story, Category } from "@/generated/prisma"

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const author = await getAuthorDetail(Number(id))
  if (!author) notFound()

  // Resolve category IDs from author's stories (primary category)
  const authorCategoryNames = [...new Set(author.stories.map(s => s.category))]
  const catRows = await prisma.category.findMany({
    where: { name: { in: authorCategoryNames } },
    select: { id: true },
  })
  const catIds = catRows.map(c => c.id)

  // Sidebar: other authors who write in the same categories,
  // sorted by average ratingAvg across their works (descending)
  const sameGenreAuthors = catIds.length > 0
    ? await prisma.$queryRaw<{ id: number; penname: string; color: string; initial: string }[]>`
        SELECT a.id, a.penname, a.color, a.initial
        FROM author a
        WHERE a.id != ${author.id}
          AND a.is_active = true
          AND EXISTS (
            SELECT 1 FROM story s
            WHERE s.author_id = a.id
              AND s.category_id = ANY(${catIds}::int[])
          )
        ORDER BY (
          SELECT AVG(s2.rating_avg)
          FROM story s2
          WHERE s2.author_id = a.id
        ) DESC NULLS LAST
        LIMIT 5
      `
    : await prisma.$queryRaw<{ id: number; penname: string; color: string; initial: string }[]>`
        SELECT a.id, a.penname, a.color, a.initial
        FROM author a
        WHERE a.id != ${author.id} AND a.is_active = true
        ORDER BY (
          SELECT AVG(s2.rating_avg) FROM story s2 WHERE s2.author_id = a.id
        ) DESC NULLS LAST
        LIMIT 5
      `

  // Sidebar: top-rated stories from same categories, not by this author.
  // Falls back to top-rated overall if fewer than 4 results.
  let recommended = await prisma.story.findMany({
    where: { authorId: { not: author.id }, categoryId: { in: catIds } },
    include: { category: true },
    orderBy: { ratingAvg: "desc" },
    take: 4,
  })
  if (recommended.length < 4) {
    const existingIds = recommended.map(s => s.id)
    const fallback = await prisma.story.findMany({
      where: {
        authorId: { not: author.id },
        ...(existingIds.length ? { id: { notIn: existingIds } } : {}),
      },
      include: { category: true },
      orderBy: { ratingAvg: "desc" },
      take: 4 - recommended.length,
    })
    recommended = [...recommended, ...fallback]
  }

  return (
    <>
      <AuthorHero
        penname={author.penname}
        bio={author.bio}
        initial={author.initial}
        color={author.color}
        joinedLabel={author.joinedLabel}
        daysWriting={author.daysWriting}
        storyCount={author.storyCount}
        totalWordsFormatted={author.totalWordsFormatted}
        facebook={author.facebook}
        twitter={author.twitter}
        website={author.website}
      />

      <div className="max-w-[1200px] w-full mx-auto pt-3 pb-8 flex gap-3 items-start">
        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="text-[12px] text-[#999] mb-3">
            <Link href="/" className="hover:text-ac transition-colors">Trang chủ</Link>
            <span className="mx-1.5 text-[#ccc]">›</span>
            <span className="text-ac font-semibold">{author.penname}</span>
          </div>

          <AuthorWorksList stories={author.stories} />
        </div>

        {/* Sidebar */}
        <div className="w-[228px] flex-shrink-0 flex flex-col gap-3">

          {/* Author info card */}
          <div className="bg-white border border-[#e5e5e5]">
            <div className="bg-panel-hd px-3 py-[9px] border-b border-[#e5e5e5]">
              <h3 className="text-[13px] font-bold text-ac">📋 Thông tin tác giả</h3>
            </div>
            <div className="p-3 flex flex-col gap-2 text-[12px]">
              <div className="flex justify-between">
                <span className="text-[#999]">Tham gia</span>
                <span className="font-medium">{author.joinedLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#999]">Tác phẩm</span>
                <span className="font-medium">{author.storyCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#999]">Tổng chữ</span>
                <span className="font-medium">{author.totalWordsFormatted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#999]">Ngày viết</span>
                <span className="font-medium">{author.daysWriting} ngày</span>
              </div>
              {author.facebook && (
                <a href={author.facebook} target="_blank" rel="noopener" className="text-ac hover:text-ac-dk transition-colors mt-1">🔗 Facebook</a>
              )}
              {author.twitter && (
                <a href={author.twitter} target="_blank" rel="noopener" className="text-ac hover:text-ac-dk transition-colors">🔗 Twitter/X</a>
              )}
              {author.website && (
                <a href={author.website} target="_blank" rel="noopener" className="text-ac hover:text-ac-dk transition-colors">🔗 Website</a>
              )}
            </div>
          </div>

          {/* Other authors */}
          {sameGenreAuthors.length > 0 && (
            <div className="bg-white border border-[#e5e5e5]">
              <div className="bg-panel-hd px-3 py-[9px] border-b border-[#e5e5e5]">
                <h3 className="text-[13px] font-bold text-ac">✍️ Tác giả cùng thể loại</h3>
              </div>
              <div className="py-1">
                {sameGenreAuthors.map(a => (
                  <Link
                    key={a.id}
                    href={`/authors/${a.id}`}
                    className="flex items-center gap-2.5 px-3 py-2.5 border-b border-[#f7f7f7] last:border-none hover:bg-[#fafafa] transition-colors group"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold text-white flex-shrink-0"
                      style={{ background: a.color }}
                    >
                      {a.initial || a.penname.charAt(0)}
                    </div>
                    <span className="text-[12.5px] font-semibold group-hover:text-ac transition-colors">{a.penname}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recommended stories */}
          {recommended.length > 0 && (
            <div className="bg-white border border-[#e5e5e5]">
              <div className="bg-panel-hd px-3 py-[9px] border-b border-[#e5e5e5]">
                <h3 className="text-[13px] font-bold text-ac">✨ Có thể bạn thích</h3>
              </div>
              <div className="py-1">
                {(recommended as (Story & { category: Category })[]).map(s => (
                  <Link
                    key={s.id}
                    href={`/stories/${s.slug}`}
                    className="flex gap-2 px-3 py-2.5 border-b border-[#f7f7f7] last:border-none hover:bg-[#fafafa] transition-colors group"
                  >
                    <div
                      className="w-10 h-[54px] rounded-[2px] flex-shrink-0 flex items-center justify-center text-[18px] shadow-[1px_2px_5px_rgba(0,0,0,.12)]"
                      style={{ background: s.coverBg }}
                    >
                      {s.coverEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] font-bold overflow-hidden text-ellipsis whitespace-nowrap mb-[2px] group-hover:text-ac transition-colors">{s.title}</div>
                      <div className="text-[11px] text-[#999] overflow-hidden text-ellipsis whitespace-nowrap">{s.category.name}</div>
                      <div className="text-[11px] text-[#999]">{s.viewCount} đọc</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
