/**
 * Create Board Article Tool
 * 게시판에 새 게시글 작성
 */

import { z } from 'zod';
import * as boardApi from '../../api/board.js';
import { formatError } from '../../utils/errors.js';

export const createBoardArticleSchema = z.object({
  boardId: z.string().describe('게시판 ID (get-board-list로 확인)'),
  subject: z.string().describe('게시글 제목'),
  body: z
    .object({
      mimeType: z.enum(['text/x-markdown', 'text/html']).describe('본문 형식'),
      content: z.string().describe('본문 내용'),
    })
    .optional()
    .describe('게시글 본문 (생략 가능)'),
});

export type CreateBoardArticleInput = z.infer<typeof createBoardArticleSchema>;

export async function createBoardArticleHandler(args: CreateBoardArticleInput) {
  try {
    const result = await boardApi.createBoardArticle({
      boardId: args.boardId,
      subject: args.subject,
      body: args.body,
    });
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (error) {
    return { content: [{ type: 'text', text: `Error: ${formatError(error)}` }], isError: true };
  }
}

export const createBoardArticleTool = {
  name: 'create-board-article',
  description: `Dooray 게시판에 새 게시글을 작성합니다.

**워크플로우**:
1. get-board-list (boardPermission: canwrite) 로 글쓰기 가능한 게시판 목록 확인
2. boardId 선택 후 create-board-article 호출

**필수**: boardId, subject
**필수 환경변수**: DOORAY_TENANT_URL

**body.mimeType**:
- text/x-markdown: Markdown 형식
- text/html: HTML 형식

Examples:
- 간단한 글: { boardId: "123", subject: "공지사항" }
- 본문 포함: { boardId: "123", subject: "공지", body: { mimeType: "text/x-markdown", content: "## 내용\\n본문입니다." } }

Returns: 생성된 게시글 정보 (ID 포함)`,
  inputSchema: {
    type: 'object',
    properties: {
      boardId: {
        type: 'string',
        description: '게시판 ID (get-board-list로 확인)',
      },
      subject: {
        type: 'string',
        description: '게시글 제목 (필수)',
      },
      body: {
        type: 'object',
        properties: {
          mimeType: {
            type: 'string',
            enum: ['text/x-markdown', 'text/html'],
            description: '본문 형식',
          },
          content: {
            type: 'string',
            description: '본문 내용',
          },
        },
        required: ['mimeType', 'content'],
        description: '게시글 본문 (생략 가능)',
      },
    },
    required: ['boardId', 'subject'],
  },
};
