package com.cyro.chat.chat_app_backend.controllers;

import com.cyro.chat.chat_app_backend.entities.Message;
import com.cyro.chat.chat_app_backend.entities.Room;
import com.cyro.chat.chat_app_backend.payload.MessageRequest;
import com.cyro.chat.chat_app_backend.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Controller
@CrossOrigin("http://localhost:3000")
public class ChatController {
    @Autowired
    private RoomRepository roomRepository;

    @MessageMapping("/sendMessage/{roomId}") // /chat/sendMesssage/roomId
    @SendTo("/topic/room/{roomId}") // subscribe
    public Message sendMessage(@DestinationVariable String roomId,
                               @RequestBody MessageRequest messageRequest){
        Room room = roomRepository.findByRoomId(messageRequest.getRoomId());
        Message message = new Message();
        message.setContent(messageRequest.getContent());
        message.setSender(messageRequest.getSender());
        message.setTimestamp(LocalDateTime.now());
        if(room != null) {
            room.getMessages().add(message);
            roomRepository.save(room);
        } else {
            throw new RuntimeException("Room not found !!");
        }
        return  message;
    }
}
