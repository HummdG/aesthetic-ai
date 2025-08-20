"""
SQLAlchemy models for product management and live verification
"""
from datetime import datetime
from typing import Optional, List
from sqlalchemy import Column, String, DateTime, ForeignKey, Text, JSON, Numeric, Index
from sqlalchemy.dialects.postgresql import UUID, ARRAY, TSVECTOR
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

from .database import Base


class Product(Base):
    """Product model for skincare products"""
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    retailer = Column(Text, nullable=False)
    retailer_sku = Column(Text, nullable=False)
    brand = Column(Text, nullable=False)
    name = Column(Text, nullable=False)
    country = Column(String(2), nullable=False)  # ISO country code
    currency = Column(Text, nullable=False)
    price = Column(Numeric(10, 2), nullable=True)
    price_per_ml = Column(Numeric(10, 4), nullable=True)
    pdp_url = Column(Text, nullable=False)
    image_url = Column(Text, nullable=True)
    gtin = Column(Text, nullable=True)
    ingredients_raw = Column(Text, nullable=False)
    ingredients_norm = Column(ARRAY(Text), nullable=False)  # Ordered INCI tokens
    ingredients_norm_set = Column(ARRAY(Text), nullable=False)  # Unique tokens for fast membership
    last_seen = Column(DateTime(timezone=True), server_default=func.now())
    last_live_verified = Column(DateTime(timezone=True), nullable=True)
    tsv = Column(TSVECTOR)  # Full-text search vector for name/brand
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    live_snapshots = relationship("LiveSnapshot", back_populates="product", cascade="all, delete-orphan")
    
    # Unique constraint on retailer + SKU
    __table_args__ = (
        Index('idx_products_retailer_sku', 'retailer', 'retailer_sku', unique=True),
        Index('idx_products_ingredients_gin', 'ingredients_norm_set', postgresql_using='gin'),
        Index('idx_products_tsv_gin', 'tsv', postgresql_using='gin'),
        Index('idx_products_country', 'country'),
        Index('idx_products_last_seen', 'last_seen'),
        Index('idx_products_last_verified', 'last_live_verified'),
    )
    
    def __repr__(self):
        return f"<Product(id={self.id}, name={self.name}, brand={self.brand})>"


class LiveSnapshot(Base):
    """Live verification snapshot model for audit trail"""
    __tablename__ = "live_snapshots"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    fetched_at = Column(DateTime(timezone=True), server_default=func.now())
    price = Column(Numeric(10, 2), nullable=True)
    currency = Column(Text, nullable=True)
    in_stock = Column(String(50), nullable=True)  # 'in_stock', 'out_of_stock', 'unknown'
    deliverable_postcode = Column(String(20), nullable=True)
    ingredients_raw = Column(Text, nullable=True)
    status_code = Column(String(10), nullable=True)  # HTTP status or error code
    source = Column(String(50), nullable=False)  # 'live_check', 'scrape', 'api'
    
    # Relationships
    product = relationship("Product", back_populates="live_snapshots")
    
    # Indices for efficient querying
    __table_args__ = (
        Index('idx_live_snapshots_product_id', 'product_id'),
        Index('idx_live_snapshots_fetched_at', 'fetched_at'),
        Index('idx_live_snapshots_source', 'source'),
    )
    
    def __repr__(self):
        return f"<LiveSnapshot(id={self.id}, product_id={self.product_id}, fetched_at={self.fetched_at})>" 