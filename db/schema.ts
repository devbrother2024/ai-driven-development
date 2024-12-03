import { integer, pgTable, serial, text, timestamp, boolean } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// 이미지 테이블
export const images = pgTable('images', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull(), // Clerk user ID
  filePath: text('file_path').notNull(), // 컬럼명 변경
  prompt: text('prompt').notNull(),
  artStyle: text('art_style').notNull(),
  colorTone: text('color_tone').notNull(),
  tags: text('tags').array().notNull().default([]),
  isPublic: boolean('is_public').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// 게시물 테이블
export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  imageId: integer('image_id').notNull().references(() => images.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(), // Clerk user ID
  title: text('title').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// 좋아요 테이블
export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(), // Clerk user ID
  createdAt: timestamp('created_at').defaultNow().notNull()
})

// 댓글 테이블
export const comments = pgTable('comments', {
  id: serial('id').primaryKey(),
  postId: integer('post_id').notNull().references(() => posts.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(), // Clerk user ID
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
})

// Relations 정의
export const imagesRelations = relations(images, ({ one }) => ({
  post: one(posts, {
    fields: [images.id],
    references: [posts.imageId]
  })
}))

export const postsRelations = relations(posts, ({ one, many }) => ({
  image: one(images, {
    fields: [posts.imageId],
    references: [images.id]
  }),
  likes: many(likes),
  comments: many(comments)
}))
