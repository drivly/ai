import { NextRequest, NextResponse } from 'next/server.js'
import { getPayload } from 'payload'
import config from '../../../../../payload.config'
import { processHumanFeedbackResponse } from '../../../../../tasks/ai/requestHumanFeedback'
import { waitUntil } from '@vercel/functions'

async function verifySlackRequest(request: NextRequest): Promise<boolean> {
  try {
    const body = await request.text()
    const timestamp = request.headers.get('x-slack-request-timestamp')
    const signature = request.headers.get('x-slack-signature')
    const signingSecret = process.env.SLACK_SIGNING_SECRET

    if (!timestamp || !signature || !signingSecret) {
      return false
    }

    const currentTime = Math.floor(Date.now() / 1000)
    if (Math.abs(currentTime - parseInt(timestamp, 10)) > 60 * 5) {
      return false
    }

    const baseString = `v0:${timestamp}:${body}`

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey('raw', encoder.encode(signingSecret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify'])

    const signatureToVerify = await crypto.subtle.sign('HMAC', key, encoder.encode(baseString))

    const signatureHex =
      'v0=' +
      Array.from(new Uint8Array(signatureToVerify))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

    return signature === signatureHex
  } catch (error) {
    console.error('Error verifying Slack request:', error)
    return false
  }
}

export async function POST(req: NextRequest) {
  try {
    const clonedReq = req.clone()
    const rawBody = await clonedReq.text()

    const isValid = await verifySlackRequest(req)
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid Slack signature' }, { status: 401 })
    }

    const payload = await getPayload({ config })

    let interactionPayload
    try {
      const formData = new URLSearchParams(rawBody)
      const payloadStr = formData.get('payload')
      if (!payloadStr) {
        return NextResponse.json({ error: 'Missing payload' }, { status: 400 })
      }
      interactionPayload = JSON.parse(payloadStr)
    } catch (error) {
      console.error('Error parsing interaction payload:', error)
      return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 })
    }

    const { type, actions, view, callback_id, user, response_url } = interactionPayload

    switch (type) {
      case 'block_actions':
        if (actions && actions.length > 0) {
          const action = actions[0]

          if (action.action_id.startsWith('human_feedback_option:')) {
            const [taskId, option] = action.value.split(':')

            await processHumanFeedbackResponse(
              {
                taskId,
                option,
                platform: 'slack',
              },
              payload,
            )

            if (response_url) {
              fetch(response_url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  blocks: [
                    {
                      type: 'section',
                      text: {
                        type: 'mrkdwn',
                        text: ':white_check_mark: Thank you for your response!',
                      },
                    },
                  ],
                  replace_original: true,
                }),
              }).catch((error) => console.error('Error updating Slack message:', error))
            }
          } else if (action.action_id === 'human_feedback_submit') {
            const taskId = action.value
            const textBlockId = `human_feedback_text:${taskId}`
            const textValue = interactionPayload.state.values[textBlockId]?.human_feedback_text_input?.value

            if (textValue) {
              await processHumanFeedbackResponse(
                {
                  taskId,
                  text: textValue,
                  platform: 'slack',
                },
                payload,
              )

              if (response_url) {
                fetch(response_url, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    blocks: [
                      {
                        type: 'section',
                        text: {
                          type: 'mrkdwn',
                          text: ':white_check_mark: Thank you for your feedback!',
                        },
                      },
                    ],
                    replace_original: true,
                  }),
                }).catch((error) => console.error('Error updating Slack message:', error))
              }
            }
          } else if (action.action_id.startsWith('human_feedback_date:')) {
            const taskId = action.action_id.split(':')[1]
            const selectedDate = action.selected_date

            await processHumanFeedbackResponse(
              {
                taskId,
                text: `Selected date: ${selectedDate}`,
                platform: 'slack',
              },
              payload,
            )

            if (response_url) {
              fetch(response_url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  blocks: [
                    {
                      type: 'section',
                      text: {
                        type: 'mrkdwn',
                        text: `:calendar: Date selected: ${selectedDate}`,
                      },
                    },
                  ],
                  replace_original: true,
                }),
              }).catch((error) => console.error('Error updating Slack message:', error))
            }
          } else if (action.action_id.startsWith('human_feedback_time:')) {
            const taskId = action.action_id.split(':')[1]
            const selectedTime = action.selected_time

            await processHumanFeedbackResponse(
              {
                taskId,
                text: `Selected time: ${selectedTime}`,
                platform: 'slack',
              },
              payload,
            )

            if (response_url) {
              fetch(response_url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  blocks: [
                    {
                      type: 'section',
                      text: {
                        type: 'mrkdwn',
                        text: `:clock3: Time selected: ${selectedTime}`,
                      },
                    },
                  ],
                  replace_original: true,
                }),
              }).catch((error) => console.error('Error updating Slack message:', error))
            }
          } else if (action.action_id.startsWith('human_feedback_multiselect:')) {
            const taskId = action.action_id.split(':')[1]
            const selectedOptions = action.selected_options.map((opt: { value: string }) => opt.value).join(', ')

            await processHumanFeedbackResponse(
              {
                taskId,
                text: `Selected options: ${selectedOptions}`,
                platform: 'slack',
              },
              payload,
            )

            if (response_url) {
              fetch(response_url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  blocks: [
                    {
                      type: 'section',
                      text: {
                        type: 'mrkdwn',
                        text: `:ballot_box_with_check: Options selected: ${selectedOptions}`,
                      },
                    },
                  ],
                  replace_original: true,
                }),
              }).catch((error) => console.error('Error updating Slack message:', error))
            }
          } else if (action.action_id.startsWith('human_feedback_overflow:')) {
            const taskId = action.action_id.split(':')[1]
            const selectedOption = action.selected_option.value

            await processHumanFeedbackResponse(
              {
                taskId,
                option: selectedOption,
                platform: 'slack',
              },
              payload,
            )

            if (response_url) {
              fetch(response_url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  blocks: [
                    {
                      type: 'section',
                      text: {
                        type: 'mrkdwn',
                        text: `:white_check_mark: Option selected: ${selectedOption}`,
                      },
                    },
                  ],
                  replace_original: true,
                }),
              }).catch((error) => console.error('Error updating Slack message:', error))
            }
          }
        }
        break

      case 'view_submission':
        if (view && callback_id && callback_id.startsWith('human_feedback_modal:')) {
          const taskId = callback_id.split(':')[1]
          const values = view.state.values

          const response: { option?: string; text?: string } = {}

          if (values && typeof values === 'object') {
            for (const [blockId, blockValues] of Object.entries(values)) {
              if (!blockValues || typeof blockValues !== 'object') continue

              const actionIds = Object.keys(blockValues)
              if (!actionIds.length) continue

              const actionId = actionIds[0]
              const actionData = blockValues[actionId as keyof typeof blockValues]

              if (!actionData || typeof actionData !== 'object') continue

              if ('value' in actionData) {
                const typedActionData = actionData as Record<string, unknown>
                const value = typedActionData.value
                if (value !== undefined) {
                  const stringValue = String(value)

                  if (blockId.includes('option_select')) {
                    response.option = stringValue
                  } else if (blockId.includes('text_input')) {
                    response.text = stringValue
                  }
                }
              }
            }
          }

          await processHumanFeedbackResponse(
            {
              taskId,
              ...response,
              platform: 'slack',
            },
            payload,
          )
        }

        return NextResponse.json({ response_action: 'clear' })

      default:
        console.log('Unhandled interaction type:', type)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing Slack interaction:', error)
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}
