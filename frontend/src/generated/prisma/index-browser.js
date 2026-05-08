
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  icon: 'icon',
  count: 'count',
  sortOrder: 'sortOrder'
};

exports.Prisma.AuthorScalarFieldEnum = {
  id: 'id',
  penname: 'penname',
  realname: 'realname',
  email: 'email',
  bio: 'bio',
  initial: 'initial',
  color: 'color',
  role: 'role',
  isActive: 'isActive',
  viewCount: 'viewCount',
  facebook: 'facebook',
  twitter: 'twitter',
  website: 'website',
  joinedAt: 'joinedAt'
};

exports.Prisma.StoryScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  author: 'author',
  authorId: 'authorId',
  synopsis: 'synopsis',
  coverBg: 'coverBg',
  coverEmoji: 'coverEmoji',
  coverImage: 'coverImage',
  status: 'status',
  isFeatured: 'isFeatured',
  viewCount: 'viewCount',
  chapterCount: 'chapterCount',
  wordCount: 'wordCount',
  ratingAvg: 'ratingAvg',
  ratingCount: 'ratingCount',
  bookmarkCount: 'bookmarkCount',
  updateSchedule: 'updateSchedule',
  categoryId: 'categoryId'
};

exports.Prisma.StoryTagScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  label: 'label'
};

exports.Prisma.SimilarStoryScalarFieldEnum = {
  storyId: 'storyId',
  similarId: 'similarId'
};

exports.Prisma.StoryCategoryScalarFieldEnum = {
  storyId: 'storyId',
  categoryId: 'categoryId'
};

exports.Prisma.VolumeScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  name: 'name',
  range: 'range',
  sortOrder: 'sortOrder',
  defaultOpen: 'defaultOpen'
};

exports.Prisma.ChapterScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  volumeId: 'volumeId',
  chapterNo: 'chapterNo',
  title: 'title',
  wordCount: 'wordCount',
  isFree: 'isFree',
  isPublished: 'isPublished',
  viewCount: 'viewCount',
  publishedAt: 'publishedAt'
};

exports.Prisma.ChapterParagraphScalarFieldEnum = {
  id: 'id',
  chapterId: 'chapterId',
  sortOrder: 'sortOrder',
  type: 'type',
  text: 'text',
  commentCount: 'commentCount'
};

exports.Prisma.CommentScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  chapterId: 'chapterId',
  initial: 'initial',
  avatarBg: 'avatarBg',
  name: 'name',
  badge: 'badge',
  text: 'text',
  likes: 'likes',
  replies: 'replies',
  liked: 'liked',
  createdAt: 'createdAt'
};

exports.Prisma.RatingScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  star: 'star',
  pct: 'pct',
  count: 'count'
};

exports.Prisma.StoryRankingScalarFieldEnum = {
  id: 'id',
  storyId: 'storyId',
  label: 'label',
  rank: 'rank',
  icon: 'icon',
  rankClass: 'rankClass'
};

exports.Prisma.RankListScalarFieldEnum = {
  id: 'id',
  type: 'type',
  title: 'title',
  genre: 'genre'
};

exports.Prisma.SlideScalarFieldEnum = {
  id: 'id',
  title: 'title',
  desc: 'desc',
  author: 'author',
  chapters: 'chapters',
  views: 'views',
  bg: 'bg',
  emoji: 'emoji',
  sortOrder: 'sortOrder'
};

exports.Prisma.SlideTagScalarFieldEnum = {
  id: 'id',
  slideId: 'slideId',
  label: 'label',
  color: 'color'
};

exports.Prisma.HotStoryScalarFieldEnum = {
  id: 'id',
  rank: 'rank',
  title: 'title',
  genres: 'genres',
  chapters: 'chapters',
  bg: 'bg',
  emoji: 'emoji',
  href: 'href'
};

exports.Prisma.UpdatedStoryScalarFieldEnum = {
  id: 'id',
  title: 'title',
  latestChapter: 'latestChapter',
  latestTitle: 'latestTitle',
  time: 'time',
  coverBg: 'coverBg',
  coverEmoji: 'coverEmoji',
  isNew: 'isNew',
  sortOrder: 'sortOrder'
};

exports.Prisma.CompletedStoryScalarFieldEnum = {
  id: 'id',
  title: 'title',
  genreInfo: 'genreInfo',
  coverBg: 'coverBg',
  coverEmoji: 'coverEmoji',
  sortOrder: 'sortOrder'
};

exports.Prisma.SidebarTopStoryScalarFieldEnum = {
  id: 'id',
  rank: 'rank',
  title: 'title',
  sub: 'sub',
  coverBg: 'coverBg',
  coverEmoji: 'coverEmoji'
};

exports.Prisma.FeaturedAuthorScalarFieldEnum = {
  id: 'id',
  rank: 'rank',
  name: 'name',
  sub: 'sub',
  coverBg: 'coverBg'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.StoryStatus = exports.$Enums.StoryStatus = {
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  HIATUS: 'HIATUS',
  DROPPED: 'DROPPED'
};

exports.Prisma.ModelName = {
  Category: 'Category',
  Author: 'Author',
  Story: 'Story',
  StoryTag: 'StoryTag',
  SimilarStory: 'SimilarStory',
  StoryCategory: 'StoryCategory',
  Volume: 'Volume',
  Chapter: 'Chapter',
  ChapterParagraph: 'ChapterParagraph',
  Comment: 'Comment',
  Rating: 'Rating',
  StoryRanking: 'StoryRanking',
  RankList: 'RankList',
  Slide: 'Slide',
  SlideTag: 'SlideTag',
  HotStory: 'HotStory',
  UpdatedStory: 'UpdatedStory',
  CompletedStory: 'CompletedStory',
  SidebarTopStory: 'SidebarTopStory',
  FeaturedAuthor: 'FeaturedAuthor'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
