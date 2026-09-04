package com.sentinel.watchlist.entity;

import jakarta.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "watchlist_items", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "symbol"})
})
public class WatchlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 20)
    private String symbol;

    @Column(name = "added_at", nullable = false, updatable = false)
    private ZonedDateTime addedAt;

    public WatchlistItem() {
    }

    public WatchlistItem(User user, String symbol) {
        this.user = user;
        this.symbol = symbol.toUpperCase().trim();
        this.addedAt = ZonedDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (addedAt == null) {
            addedAt = ZonedDateTime.now();
        }
        if (symbol != null) {
            symbol = symbol.toUpperCase().trim();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol != null ? symbol.toUpperCase().trim() : null;
    }

    public ZonedDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(ZonedDateTime addedAt) {
        this.addedAt = addedAt;
    }
}
