/**
 * Get Board List Tool
 * 접근 가능한 게시판 목록 조회
 */

import { z } from 'zod';
import * as boardApi from '../../api/board.js';
import { formatError } from '../../utils/errors.js';

export const getBoardListSchema = z.object({
  boardPermission: z
    .enum(['canwrite', 'canread'])
    .optional()
    .describe('필터: canwrite=글쓰기 가능한 게시판만, 생략 시 전체'),
});

export type GetBoardListInput = z.infer<typeof getBoardListSchema>;

export async function getBoardListHandler(args: GetBoardListInput) {
  try {
    const result = await boardApi.getBoardList({ boardPermission: args.boardPermission });
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (error) {
    return { content: [{ type: 'text', text: `Error: ${formatError(error)}` }], isError: true };
  }
}

export const getBoardListTool = {
  name: 'get-board-list',
  description: `Dooray 게시판(Board) 목록을 조회합니다.

**필수 환경변수**: DOORAY_TENANT_URL (예: https://ligaccuver.dooray.com)

**boardPermission 필터**:
- 생략: 접근 가능한 모든 게시판
- canwrite: 글쓰기 가능한 게시판만 (새글 쓰기 전 사용)

Returns: 게시판 ID, 이름, 설명 목록`,
  inputSchema: {
    type: 'object',
    properties: {
      boardPermission: {
        type: 'string',
        enum: ['canwrite', 'canread'],
        description: '필터: canwrite=글쓰기 가능한 게시판만',
      },
    },
  },
};
