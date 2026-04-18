export interface PushMessage {
  to: string
  sound?: string
  title: string
  body: string
  data?: Record<string, unknown>
}

// Expo Push API receipt response
interface PushTicket {
  status: 'ok' | 'error'
  id?: string
  message?: string
  details?: unknown
}

// Send push notifications in batches of 100 (Expo limit)
export async function sendPushNotifications(messages: PushMessage[]): Promise<void> {
  if (messages.length === 0) return

  for (let i = 0; i < messages.length; i += 100) {
    const batch = messages.slice(i, i + 100)

    let response: Response
    try {
      response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(batch),
      })
    } catch (error) {
      console.error('Push notification fetch failed:', error)
      continue
    }

    if (!response.ok) {
      console.error(
        'Push notification batch failed:',
        response.status,
        await response.text()
      )
      continue
    }

    const result = (await response.json()) as { data: PushTicket[] }

    for (const ticket of result.data) {
      if (ticket.status === 'error') {
        console.error('Push notification error:', ticket.message, ticket.details)
      }
    }
  }
}
