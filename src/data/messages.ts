export interface Message {
  id: string
  text: string
  sender: 'bestie' | 'user'
  timestamp?: string
  hasGiftCard?: boolean
}

export const smsMessages: Message[] = [
  {
    id: '1',
    text: 'HAPPY BIRTHDAY!!! OMG can\'t believe ur getting so old lol',
    sender: 'bestie',
  },
  {
    id: '2',
    text: 'No way!! I\'m basically still a baby thx bestie!!',
    sender: 'user',
    timestamp: 'Read 12:01 AM',
  },
  {
    id: '3',
    text: 'Anyway, sent you a lil something for tonight! check it',
    sender: 'bestie',
    hasGiftCard: true,
  },
]
