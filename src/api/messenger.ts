/**
 * Dooray Messenger API
 * 채널 목록 조회, 메시지 전송, DM 전송, 메시지 히스토리 조회
 */

import { getClient } from './client.js';

const MESSENGER_BASE = '/messenger/v1';

export interface MessengerChannel {
  id: string;
  type: string;
  name?: string;
  members?: Array<{ id: string; name?: string }>;
  lastMessage?: {
    content: string;
    createdAt: string;
  };
}

export interface MessengerMessage {
  id: string;
  content: string;
  createdAt: string;
  sender?: {
    id: string;
    name?: string;
  };
}

export interface SendChannelMessageParams {
  channelId: string;
  text: string;
}

export interface SendDirectMessageParams {
  memberId: string;
  text: string;
}

export interface GetChannelMessagesParams {
  channelId: string;
  page?: number;
  size?: number;
}

/**
 * 채널 목록 조회
 */
export async function getChannels(): Promise<MessengerChannel[]> {
  const client = getClient();
  return client.get(`${MESSENGER_BASE}/channels`);
}

/**
 * 채널에 메시지 전송
 */
export async function sendChannelMessage(params: SendChannelMessageParams): Promise<unknown> {
  const client = getClient();
  return client.post(`${MESSENGER_BASE}/channels/${params.channelId}/logs`, {
    text: params.text,
  });
}

/**
 * 다이렉트 메시지(DM) 전송
 */
export async function sendDirectMessage(params: SendDirectMessageParams): Promise<unknown> {
  const client = getClient();
  return client.post(`${MESSENGER_BASE}/channels/direct-send`, {
    organizationMemberId: params.memberId,
    text: params.text,
  });
}

/**
 * 채널 메시지 히스토리 조회
 */
export async function getChannelMessages(params: GetChannelMessagesParams): Promise<MessengerMessage[]> {
  const client = getClient();
  return client.get(`${MESSENGER_BASE}/channels/${params.channelId}/logs`, {
    page: params.page ?? 0,
    size: params.size ?? 50,
  });
}
