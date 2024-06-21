const Notification = require('../models/notificationModel');
const Garden = require('../models/gardenModel');
const Plant = require('../models/plantModel');

const sendNotifications = async (user_id) => {
    const today = new Date();
    const month = today.getMonth() + 1; // Lunile încep de la 0
    const date = today.toISOString().split('T')[0];

    console.log(`sendNotifications called with user_id: ${user_id}`);
    console.log(`Today: ${today}`);
    console.log(`Month: ${month}`);
    console.log(`Date: ${date}`);

    // Notificări extreme
    if ([1, 2, 7, 8].includes(month)) {
        console.log('Checking extreme notifications');
        const existingNotifications = await Notification.findByUserAndDate(user_id, date, 'extreme');
        console.log(`Existing extreme notifications: ${existingNotifications.length}`);
        if (existingNotifications.length === 0) {
            let message = '';
            if ([7, 8].includes(month)) {
                message = 'Suntem in perioada cea mai calda din an, asigura-te ca plantele tale au suficienta apa';
            } else {
                message = 'Suntem in perioada cea mai rece din an, ai grija ca plantele tale sa fie bine protejate de inghet';
            }
            console.log(`Creating extreme notification: ${message}`);
            await Notification.create(user_id, message, 'extreme');
            console.log(`Extreme notification created: ${message}`);
        }
    }

    // Notificări de perioade pentru plante din grădină
    console.log('Fetching garden plants');
    const gardenPlants = await Garden.findByUserId(user_id);
    console.log(`Garden plants found: ${gardenPlants.length}`);
    for (const plant of gardenPlants) {
        console.log(`Plant: ${plant.name}, Harvest Period: ${plant.harvest_period}`);
        const periods = ['prune_period', 'fertilize_period', 'harvest_period'];
        for (const period of periods) {
            if (plant[period] && plant[period].split(',').includes(month.toString())) {
                console.log(`Checking ${period} notifications for plant: ${plant.name}`);
                const existingNotifications = await Notification.findByUserAndDate(user_id, date, 'period');
                const oneWeekAgo = new Date(today);
                oneWeekAgo.setDate(today.getDate() - 7);

                console.log(`Existing period notifications: ${existingNotifications.length}`);
                if (existingNotifications.length === 0 || new Date(existingNotifications[0].date_sent) < oneWeekAgo) {
                    const periodMessages = {
                        prune_period: 'tundem',
                        fertilize_period: 'fertilizăm',
                        harvest_period: 'recoltăm'
                    };
                    const message = `Este momentul să ${periodMessages[period]} ${plant.name}`;
                    console.log(`Creating period notification: ${message}`);
                    await Notification.create(user_id, message, 'period');
                    console.log(`Period notification created: ${message}`);
                }
            }
        }
    }

    // Notificări de perioade pentru plante din plantotecă
    console.log('Fetching plantoteca plants');
    const plantotecaPlants = await Plant.findAll();
    console.log(`Plantoteca plants found: ${plantotecaPlants.length}`);
    for (const plant of plantotecaPlants) {
        if (plant.plant_period && plant.plant_period.split(',').includes(month.toString())) {
            console.log(`Checking plant period notifications for plant: ${plant.name}`);
            const existingNotifications = await Notification.findByUserAndDate(user_id, date, 'period');
            const oneWeekAgo = new Date(today);
            oneWeekAgo.setDate(today.getDate() - 7);

            console.log(`Existing plant period notifications: ${existingNotifications.length}`);
            if (existingNotifications.length === 0 || new Date(existingNotifications[0].date_sent) < oneWeekAgo) {
                const message = `Este momentul sa plantezi ${plant.name}`;
                console.log(`Creating plant period notification: ${message}`);
                await Notification.create(user_id, message, 'period');
                console.log(`Planting notification created: ${message}`);
            }
        }
    }
};

const getNotifications = async (req, res) => {
    const user_id = req.session.user_id;

    if (!user_id) {
        return res.status(401).send({ message: 'Not authenticated' });
    }

    console.log(`getNotifications called with user_id: ${user_id}`);
    
    let notifications = await Notification.findAllByUser(user_id);

    if (notifications.length === 0) {
        console.log('No notifications found, creating new notifications if needed');
        await sendNotifications(user_id); // Pass the selectedDate here
        notifications = await Notification.findAllByUser(user_id);
    }

    res.send(notifications);
};

module.exports = { sendNotifications, getNotifications };
