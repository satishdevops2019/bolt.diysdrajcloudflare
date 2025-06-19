-- Users Table
CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_picture_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Listings Table
CREATE TABLE IF NOT EXISTS Listings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    price_per_night DECIMAL(10,2) NOT NULL,
    max_guests INTEGER NOT NULL,
    num_bedrooms INTEGER NOT NULL,
    num_beds INTEGER NOT NULL,
    num_bathrooms DECIMAL(3,1) NOT NULL,
    amenities TEXT[], -- Array of text strings for amenities
    property_type VARCHAR(100), -- e.g., 'House', 'Apartment', 'Condo', 'Private Room'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS Bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    listing_id INTEGER REFERENCES Listings(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    num_guests INTEGER NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- e.g., pending, confirmed, cancelled, completed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_dates CHECK (check_out_date > check_in_date)
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS Reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    listing_id INTEGER REFERENCES Listings(id) ON DELETE CASCADE,
    booking_id INTEGER REFERENCES Bookings(id) ON DELETE CASCADE UNIQUE, -- A review is tied to a specific booking
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_review_per_booking UNIQUE (user_id, listing_id, booking_id) -- Ensures a user can't review the same booking multiple times (booking_id UNIQUE already handles this mostly)
);

-- Potential Indexes for Listings table for filtering performance
-- (Add these as comments for now, can be uncommented and run by user in their DB)
-- CREATE INDEX IF NOT EXISTS idx_listings_price ON Listings (price_per_night);
-- CREATE INDEX IF NOT EXISTS idx_listings_property_type ON Listings (LOWER(property_type)); -- For case-insensitive search
-- CREATE INDEX IF NOT EXISTS idx_listings_num_bedrooms ON Listings (num_bedrooms);
-- CREATE INDEX IF NOT EXISTS idx_listings_num_bathrooms ON Listings (num_bathrooms);
-- CREATE INDEX IF NOT EXISTS idx_listings_num_beds ON Listings (num_beds);
-- CREATE INDEX IF NOT EXISTS idx_listings_amenities ON Listings USING GIN (amenities); -- GIN index for array containment operations
