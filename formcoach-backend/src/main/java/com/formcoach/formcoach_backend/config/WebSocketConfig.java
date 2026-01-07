package com.formcoach.formcoach_backend.config;

import com.formcoach.formcoach_backend.security.CustomUserDetailsService;
import com.formcoach.formcoach_backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

// enables websocket and stomp messaging allowing for biconditional connection between client and server
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {


    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Autowired
    public WebSocketConfig(JwtService jwtService, CustomUserDetailsService userDetailsService) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Registers websocket endpoint that client connects to
     */
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").setAllowedOrigins("http://localhost:3000").withSockJS();
    }

    /**
     * Configure message broker
     * enable simple memory based message broker to carry messages back to client
     */
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    /**
     * Since Websocket/STOMP does not have spring security context by default
     * Intercept each message and add spring security context authenticated user
     * On connection verify token and set auth
     * On send get auth and set identity of current authenticated user
     */
    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor =
                        MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authHeader = accessor.getFirstNativeHeader("Authorization");

                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7);
                        String username = jwtService.getUsernameFromJWT(token);

                        if (username != null && jwtService.validateToken(token)) {
                            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
                            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());

                            accessor.getSessionAttributes().put("auth", auth);
                            SecurityContextHolder.getContext().setAuthentication(auth);
                        }
                    }
                } else if (StompCommand.SEND.equals(accessor.getCommand())) {
                    UsernamePasswordAuthenticationToken auth =
                            (UsernamePasswordAuthenticationToken) accessor.getSessionAttributes().get("auth");

                    if (auth != null) {
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        // set entity to represent userId
                        accessor.setUser(auth);
                    }
                }
                return message;
            }
        });
    }

}
