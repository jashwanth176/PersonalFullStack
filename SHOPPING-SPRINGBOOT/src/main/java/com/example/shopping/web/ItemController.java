package com.example.shopping.web;

import com.example.shopping.model.Item;
import com.example.shopping.repo.ItemRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/items")
@CrossOrigin(origins = "*")
public class ItemController {
    private final ItemRepository repository;

    public ItemController(ItemRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Item> all() {
        return repository.findAll();
    }

    @PostMapping
    public ResponseEntity<Item> add(@Valid @RequestBody Item item) {
        Item saved = repository.save(item);
        return ResponseEntity.created(URI.create("/api/items/" + saved.getId())).body(saved);
    }
}
