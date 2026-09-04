package com.sentinel.watchlist.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "stock_snapshots", indexes = {
    @Index(name = "idx_stock_snapshots_symbol_ts", columnList = "symbol, timestamp")
})
public class StockSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String symbol;

    @Column(name = "company_name", nullable = false, length = 100)
    private String companyName;

    @Column(nullable = false, length = 50)
    private String sector;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private Long volume;

    @Column(nullable = false)
    private ZonedDateTime timestamp;

    public StockSnapshot() {
    }

    public StockSnapshot(String symbol, String companyName, String sector, BigDecimal price, Long volume, ZonedDateTime timestamp) {
        this.symbol = symbol.toUpperCase().trim();
        this.companyName = companyName;
        this.sector = sector;
        this.price = price;
        this.volume = volume;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol != null ? symbol.toUpperCase().trim() : null;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Long getVolume() {
        return volume;
    }

    public void setVolume(Long volume) {
        this.volume = volume;
    }

    public ZonedDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(ZonedDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
