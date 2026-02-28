/**
 * Get Messenger Channels Tool
 * 접근 가능한 Dooray 메신저 채널 목록 조회
 */

import { z } from 'zod';
import * as messengerApi from '../../api/messenger.js';
import { formatError } from '../../utils/errors.js';

export const getChannelsSchema = z.object({});

export type GetChannelsInput = z.infer<typeof getChannelsSchema>;

export async function getChannelsHandler(_args: GetChannelsInput) {
  try {
    const result = await messengerApi.getChannels();
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

export const getChannelsTool = {
  name: 'get-messenger-channels',
  description: `Dooray 메신저 채널 목록을 조회합니다.

나의 멤버가 속해 있는 채널(단체 채팅방, DM 채널 등) 목록을 반환합니다.
채널 ID는 메시지 전송이나 메시지 히스토리 조회 시 필요합니다.

**사용 예시**:
- 채널 목록 조회: {} (파라미터 없음)

Returns: 채널 목록 (id, type, name, members 등 포함)`,
  inputSchema: {
    type: 'object',
    properties: {},
    required: [],
  },
};
