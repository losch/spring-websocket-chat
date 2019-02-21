package websocketchat

import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class ClientVariablesController {

    @Value("\${websocket:ws://localhost:8080}")
    lateinit var websocket: String

    @GetMapping("/variables{variable.+}js")
    fun getVariablesJs() =
        """
        window.variables = { brokerURL: "$websocket/chat/websocket" };
        """.trimIndent()
}
