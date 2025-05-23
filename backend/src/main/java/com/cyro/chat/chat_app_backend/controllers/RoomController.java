package com.cyro.chat.chat_app_backend.controllers;

import com.cyro.chat.chat_app_backend.entities.Message;
import com.cyro.chat.chat_app_backend.entities.Room;
import com.cyro.chat.chat_app_backend.repositories.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/rooms")
@CrossOrigin("http://localhost:3000")
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    @GetMapping("/health-check")
    public ResponseEntity<String> healthCheck(){
        return  new ResponseEntity<>("Ok ! ", HttpStatus.OK);
    }

    // create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String roomId){

        if(roomRepository.findByRoomId(roomId) != null ){
            return  ResponseEntity.badRequest().body("Room already exists! ");
        }

        // create new room
        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom = roomRepository.save(room);
        return  ResponseEntity.status(HttpStatus.CREATED).body(room);

    }

    // get room : join
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId){
        Room byRoomId = roomRepository.findByRoomId(roomId);
        if(byRoomId == null) return  new ResponseEntity<>("Room not found !", HttpStatus.BAD_REQUEST);

        return  new ResponseEntity<>(byRoomId, HttpStatus.OK);
    }

    // get messages of the room
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<?> getMessages(@PathVariable String roomId,
                                         @RequestParam(value = "page", defaultValue = "0", required = false ) int page,
                                         @RequestParam(value = "size", defaultValue = "20", required = false) int size){
        Room room = roomRepository.findByRoomId(roomId);
        if(room == null) return  new ResponseEntity<>("Room not found !", HttpStatus.BAD_REQUEST);

        // get messages
        List<Message> messages = room.getMessages();

        // pagination
//        int start = Math.max(0, messages.size() - (page - 1) * size);
//        int end = Math.min(messages.size(), start + size);
//        List<Message> paginatedMessages = messages.subList(start, end);

        return new ResponseEntity<>(messages, HttpStatus.OK);


    }
}
