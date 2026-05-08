'use client'

import { useState } from 'react'
import { type FontKey, type LhKey } from '@/components/reader/reader-settings'
import ReaderHeader from '@/components/reader/ReaderHeader'
import ReaderBreadcrumb from '@/components/reader/ReaderBreadcrumb'
import BookIntro from '@/components/reader/BookIntro'
import ChapterCard from '@/components/reader/ChapterCard'
import ChapterNav from '@/components/reader/ChapterNav'
import type { ChapterData } from '@/services/chapter.service'

type Props = {
  chapter: ChapterData
  storyId: string
}

export default function ChapterView({ chapter, storyId }: Props) {
  const [isNight] = useState(false)
  const [fontSize] = useState<FontKey>('md')
  const [lineHeight] = useState<LhKey>('normal')

  return (
    <div
      className={`reader min-h-screen transition-colors duration-300${isNight ? ' night' : ''}`}
      style={{ background: 'var(--rd-bg)', color: 'var(--rd-text)', fontSize: 14, lineHeight: 1.5 }}
    >
      <ReaderHeader />

      <ReaderBreadcrumb
        genres={chapter.genres.map(g => ({ label: g, href: '#' }))}
        storyTitle={chapter.storyTitle}
        storyHref={`/stories/${storyId}`}
        chapterNo={chapter.chapterNo}
      />

      <div className="max-w-[820px] mx-auto pb-[60px] flex flex-col">
        <BookIntro
          cover={chapter.cover}
          storyTitle={chapter.storyTitle}
          author={chapter.author}
          genres={chapter.genres}
          publishedDate={chapter.publishedDate}
          totalWords={chapter.wordCount}
          readerCount={chapter.readerCount}
        />

        <ChapterNav
          storyId={storyId}
          prevChapter={chapter.prevChapter}
          nextChapter={chapter.nextChapter}
        />

        <ChapterCard
          chapterNo={chapter.chapterNo}
          chapterTitle={chapter.chapterTitle}
          storyTitle={chapter.storyTitle}
          author={chapter.author}
          wordCount={chapter.wordCount}
          date={chapter.date}
          paragraphs={chapter.paragraphs}
          fontSize={fontSize}
          lineHeight={lineHeight}
        />

        {/* <AuthorNote author={chapter.author} note="" /> */}

        {/* <TipSection tipCount={0} tipAvatars={[]} /> */}

        <ChapterNav
          storyId={storyId}
          prevChapter={chapter.prevChapter}
          nextChapter={chapter.nextChapter}
        />
      </div>
    </div>
  )
}
