/**
 * Send Channel Message Tool
 * Dooray 메신저 채널에 메시지 전송
 */

import { z } from 'zod';
import * as messengerApi from '../../api/messenger.js';
import { formatError } from '../../utils/errors.js';

export const sendChannelMessageSchema = z.object({
  channelId: z.string().describe('메시지를 보낼 채널 ID (get-messenger-channels로 조회 가능)'),
  text: z.string().describe('전송할 메시지 내용'),
});

export type SendChannelMessageInput = z.infer<typeof sendChannelMessageSchema>;

export async function sendChannelMessageHandler(args: SendChannelMessageInput) {
  try {
    const result = await messengerApi.sendChannelMessage({
      channelId: args.channelId,
      text: args.text,
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

export const sendChannelMessageTool = {
  name: 'send-messenger-channel-message',
  description: `Dooray 메신저 채널(단체 채팅방)에 메시지를 전송합니다.

채널 ID는 get-messenger-channels 툴로 먼저 조회해야 합니다.

**파라미터**:
- channelId: 채널 ID (필수)
- text: 전송할 메시지 내용 (필수)

**사용 예시**:
{
  "channelId": "채널ID",
  "text": "안녕하세요! 메시지 내용입니다."
}

Returns: 전송 결과`,
  inputSchema: {
    type: 'object',
    properties: {
      channelId: {
        type: 'string',
        description: '메시지를 보낼 채널 ID (get-messenger-channels로 조회 가능)',
      },
      text: {
        type: 'string',
        description: '전송할 메시지 내용',
      },
    },
    required: ['channelId', 'text'],
  },
};
