package websocketchat.inout

import java.time.LocalDateTime

data class ChatMessageOut(
    val timestamp: LocalDateTime,
    val name: String,
    val contents: String
)