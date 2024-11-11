import mysql.connector
import pandas as pd


db_config = {
    'user': 'root',          
    'password': 'password',  
    'host': 'localhost',     
}

connection = mysql.connector.connect(**db_config)
cursor = connection.cursor()

cursor.execute("DROP DATABASE IF EXISTS card_db")
cursor.execute("CREATE DATABASE card_db")
cursor.execute("USE card_db")

create_cards_table = """
CREATE TABLE cards (
    id INT PRIMARY KEY,
    image_url1 VARCHAR(500),
    image_url2 VARCHAR(500),
    image_url3 VARCHAR(500),
    image_url4 VARCHAR(500),
    time VARCHAR(50),
    experience_date DATE,
    title VARCHAR(255),
    price DECIMAL(10, 2),
    hosted_by VARCHAR(100),
    description TEXT,
    telephone VARCHAR(15),
    email VARCHAR(100),
    rating DECIMAL(2, 1) DEFAULT 0,
    review_count INT DEFAULT 0,
    FULLTEXT(title, description)
);
"""

create_reviews_table = """
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    card_id INT,
    reviewer_name VARCHAR(100),
    review_text TEXT,
    rating DECIMAL(2, 1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);
"""

# Create tables
cursor.execute(create_cards_table)
cursor.execute(create_reviews_table)

trigger_update_after_insert = """
CREATE TRIGGER update_rating_after_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE cards
    SET rating = (SELECT AVG(rating) FROM reviews WHERE card_id = NEW.card_id),
        review_count = (SELECT COUNT(*) FROM reviews WHERE card_id = NEW.card_id)
    WHERE id = NEW.card_id;
END
"""

trigger_update_after_delete = """
CREATE TRIGGER update_rating_after_delete
AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    UPDATE cards
    SET rating = IFNULL((SELECT AVG(rating) FROM reviews WHERE card_id = OLD.card_id), 0),
        review_count = (SELECT COUNT(*) FROM reviews WHERE card_id = OLD.card_id)
    WHERE id = OLD.card_id;
END
"""

cursor.execute(trigger_update_after_insert)
cursor.execute(trigger_update_after_delete)

excel_file = r'raw_path'
cards_df = pd.read_excel(excel_file, sheet_name='card')
reviews_df = pd.read_excel(excel_file, sheet_name='reviews')

for _, row in cards_df.iterrows():
    cursor.execute("""
        INSERT INTO cards (id, image_url1, image_url2, image_url3, image_url4, time, experience_date, title, price, hosted_by, description, telephone, email)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        row['id'], row['image_url1'], row['image_url2'], row['image_url3'], row['image_url4'],
        row['time'], row['experience_date'], row['title'], row['price'], row['Hosted by'],
        row['description'], row['telephone'], row['email']
    ))

for _, row in reviews_df.iterrows():
    cursor.execute("""
        INSERT INTO reviews (card_id, reviewer_name, review_text, rating)
        VALUES (%s, %s, %s, %s)
    """, (
        row['id'], row['reviewer_name'], row['review_text'], row['rating']
    ))

connection.commit()

cursor.execute("SELECT * FROM cards")
cards = cursor.fetchall()
print("Cards Table:")
for card in cards:
    print(card)

cursor.execute("SELECT * FROM reviews")
reviews = cursor.fetchall()
print("\nReviews Table:")
for review in reviews:
    print(review)

cursor.close()
connection.close()
