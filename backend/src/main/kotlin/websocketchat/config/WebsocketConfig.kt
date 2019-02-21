package websocketchat.config

import org.springframework.context.annotation.Configuration
import org.springframework.messaging.simp.config.MessageBrokerRegistry
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker
import org.springframework.web.socket.config.annotation.StompEndpointRegistry
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer

@Configuration
@EnableWebSocketMessageBroker
class WebsocketConfig : WebSocketMessageBrokerConfigurer {

    override fun configureMessageBroker(registry: MessageBrokerRegistry) {
        registry.apply {
            enableSimpleBroker("/topic", "/app")
            setApplicationDestinationPrefixes("/app")
        }
    }

    override fun registerStompEndpoints(registry: StompEndpointRegistry) {
        registry.apply {
            addEndpoint("/chat")
                .setAllowedOrigins("*")
                .withSockJS()
        }
    }
}
