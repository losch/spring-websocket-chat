package websocketchat

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.messaging.handler.annotation.MessageMapping
import org.springframework.messaging.handler.annotation.SendTo
import org.springframework.stereotype.Controller
import websocketchat.inout.ChatMessageIn
import websocketchat.inout.ChatMessageOut
import java.time.LocalDateTime
import org.springframework.messaging.simp.annotation.SubscribeMapping

@Controller
class ChatMessagesController {

    companion object {
        val log: Logger = LoggerFactory.getLogger(this::class.java)

        val MESSAGE_HISTORY_SIZE = 50
    }

    private var previousMessages = listOf<ChatMessageOut>()

    @SubscribeMapping("/chatMessages")
    fun onSubscription(): List<ChatMessageOut> {
        log.info("Someone subscribed to chatMessages topic")
        return previousMessages
    }

    @MessageMapping("/chatMessage")
    @SendTo("/app/chatMessages")
    fun chatMessage(message: ChatMessageIn): List<ChatMessageOut> {
        log.info("Someone sent a message: $message")

        val messagesOut = listOf(ChatMessageOut(
            timestamp = LocalDateTime.now(),
            name = message.name.take(10),
            contents = message.contents
        ))

        previousMessages = (previousMessages + messagesOut).take(MESSAGE_HISTORY_SIZE)

        return messagesOut
    }
}
