const db = require('./db');

const Notification = {
    findAllByUser: (user_id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM notifications WHERE user_id = ?';
            db.query(query, [user_id], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    findByUserAndDate: (user_id, date, type) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM notifications WHERE user_id = ? AND DATE(date_sent) = ? AND notification_type = ?';
            db.query(query, [user_id, date, type], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    },

    create: (user_id, message, type) => {
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO notifications (user_id, message, notification_type, date_sent) VALUES (?, ?, ?, NOW())';
            console.log(`Executing query: ${query} with values (${user_id}, ${message}, ${type})`);
            db.query(query, [user_id, message, type], (err, results) => {
                if (err) return reject(err);
                console.log(`Notification created with ID: ${results.insertId}`);
                resolve(results);
            });
        });
    }
};

module.exports = Notification;
