/**
 * Get Board Article Tool
 * 특정 게시글 상세 조회
 */

import { z } from 'zod';
import * as boardApi from '../../api/board.js';
import { formatError } from '../../utils/errors.js';

export const getBoardArticleSchema = z.object({
  boardId: z.string().describe('게시판 ID'),
  articleId: z.string().describe('게시글 ID'),
});

export type GetBoardArticleInput = z.infer<typeof getBoardArticleSchema>;

export async function getBoardArticleHandler(args: GetBoardArticleInput) {
  try {
    const result = await boardApi.getBoardArticle(args.boardId, args.articleId);
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (error) {
    return { content: [{ type: 'text', text: `Error: ${formatError(error)}` }], isError: true };
  }
}

export const getBoardArticleTool = {
  name: 'get-board-article',
  description: `게시판의 특정 게시글 상세 내용을 조회합니다.

**필수**: boardId + articleId (get-board-article-list로 확인)
**필수 환경변수**: DOORAY_TENANT_URL

Returns: 게시글 제목, 본문 내용(HTML/Markdown), 작성자, 작성일`,
  inputSchema: {
    type: 'object',
    properties: {
      boardId: {
        type: 'string',
        description: '게시판 ID',
      },
      articleId: {
        type: 'string',
        description: '게시글 ID',
      },
    },
    required: ['boardId', 'articleId'],
  },
};
