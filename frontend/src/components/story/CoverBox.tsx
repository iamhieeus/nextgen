import Image from "next/image"

export type Cover = { bg: string; emoji: string; image?: string }

type CoverBoxProps = {
  cover: Cover
  className?: string
  emojiSize?: string
}

export default function CoverBox({ cover, className = "", emojiSize = "text-[34px]" }: CoverBoxProps) {
  if (cover.image) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <Image
          src={cover.image}
          alt="cover"
          fill
          className="object-cover"
          sizes="200px"
        />
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: cover.bg }}
    >
      <span className={emojiSize}>{cover.emoji}</span>
    </div>
  )
}
