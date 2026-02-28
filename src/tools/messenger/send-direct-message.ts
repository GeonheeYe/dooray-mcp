/**
 * Send Direct Message Tool
 * Dooray 메신저 DM(다이렉트 메시지) 전송
 */

import { z } from 'zod';
import * as messengerApi from '../../api/messenger.js';
import { formatError } from '../../utils/errors.js';

export const sendDirectMessageSchema = z.object({
  memberId: z.string().describe('DM을 보낼 대상 멤버 ID (get-project-member-list 또는 get-my-member-info로 조회 가능)'),
  text: z.string().describe('전송할 메시지 내용'),
});

export type SendDirectMessageInput = z.infer<typeof sendDirectMessageSchema>;

export async function sendDirectMessageHandler(args: SendDirectMessageInput) {
  try {
    const result = await messengerApi.sendDirectMessage({
      memberId: args.memberId,
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

export const sendDirectMessageTool = {
  name: 'send-messenger-direct-message',
  description: `Dooray 메신저에서 특정 멤버에게 DM(다이렉트 메시지)을 전송합니다.

멤버 ID는 get-project-member-list 또는 get-my-member-info 툴로 조회할 수 있습니다.

**파라미터**:
- memberId: 수신자 멤버 ID (필수)
- text: 전송할 메시지 내용 (필수)

**워크플로우**:
1. get-project-member-list로 대상 멤버의 ID 조회
2. send-messenger-direct-message로 DM 전송

**사용 예시**:
{
  "memberId": "멤버ID",
  "text": "안녕하세요! 확인 부탁드립니다."
}

Returns: 전송 결과`,
  inputSchema: {
    type: 'object',
    properties: {
      memberId: {
        type: 'string',
        description: 'DM을 보낼 대상 멤버 ID (get-project-member-list로 조회 가능)',
      },
      text: {
        type: 'string',
        description: '전송할 메시지 내용',
      },
    },
    required: ['memberId', 'text'],
  },
};
