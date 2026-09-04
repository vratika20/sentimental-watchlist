package com.sentinel.watchlist.entity;

import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "last_active_timestamp")
    private ZonedDateTime lastActiveTimestamp;

    @Column(name = "created_at", nullable = false, updatable = false)
    private ZonedDateTime createdAt;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<WatchlistItem> watchlistItems = new ArrayList<>();

    public User() {
    }

    public User(String name, String email) {
        this.name = name;
        this.email = email;
        this.createdAt = ZonedDateTime.now();
        this.lastActiveTimestamp = ZonedDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = ZonedDateTime.now();
        }
        if (lastActiveTimestamp == null) {
            lastActiveTimestamp = ZonedDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public ZonedDateTime getLastActiveTimestamp() {
        return lastActiveTimestamp;
    }

    public void setLastActiveTimestamp(ZonedDateTime lastActiveTimestamp) {
        this.lastActiveTimestamp = lastActiveTimestamp;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(ZonedDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<WatchlistItem> getWatchlistItems() {
        return watchlistItems;
    }

    public void setWatchlistItems(List<WatchlistItem> watchlistItems) {
        this.watchlistItems = watchlistItems;
    }

    public void addWatchlistItem(WatchlistItem item) {
        watchlistItems.add(item);
        item.setUser(this);
    }

    public void removeWatchlistItem(WatchlistItem item) {
        watchlistItems.remove(item);
        item.setUser(null);
    }
}
