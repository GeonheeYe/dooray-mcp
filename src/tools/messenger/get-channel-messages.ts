/**
 * Get Channel Messages Tool
 * Dooray 메신저 채널의 메시지 히스토리 조회
 */

import { z } from 'zod';
import * as messengerApi from '../../api/messenger.js';
import { formatError } from '../../utils/errors.js';

export const getChannelMessagesSchema = z.object({
  channelId: z.string().describe('메시지를 조회할 채널 ID (get-messenger-channels로 조회 가능)'),
  page: z.number().optional().describe('페이지 번호 (0부터 시작, 기본값: 0)'),
  size: z.number().optional().describe('페이지당 메시지 수 (기본값: 50)'),
});

export type GetChannelMessagesInput = z.infer<typeof getChannelMessagesSchema>;

export async function getChannelMessagesHandler(args: GetChannelMessagesInput) {
  try {
    const result = await messengerApi.getChannelMessages({
      channelId: args.channelId,
      page: args.page,
      size: args.size,
    });
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${formatError(error)}`,
        },
      ],
      isError: true,
    };
  }
}

export const getChannelMessagesTool = {
  name: 'get-messenger-channel-messages',
  description: `Dooray 메신저 채널의 메시지 히스토리를 조회합니다.

채널 ID는 get-messenger-channels 툴로 먼저 조회해야 합니다.

**파라미터**:
- channelId: 채널 ID (필수)
- page: 페이지 번호 (선택, 기본값: 0)
- size: 페이지당 메시지 수 (선택, 기본값: 50)

**사용 예시**:
{
  "channelId": "채널ID",
  "size": 20
}

Returns: 메시지 목록 (id, content, createdAt, sender 등 포함)`,
  inputSchema: {
    type: 'object',
    properties: {
      channelId: {
        type: 'string',
        description: '메시지를 조회할 채널 ID (get-messenger-channels로 조회 가능)',
      },
      page: {
        type: 'number',
        description: '페이지 번호 (0부터 시작, 기본값: 0)',
      },
      size: {
        type: 'number',
        description: '페이지당 메시지 수 (기본값: 50)',
      },
    },
    required: ['channelId'],
  },
};
