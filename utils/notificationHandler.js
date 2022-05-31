const axios = require("axios");

const sendNotification = async (title ,message, type, orderId, deviceToken) => {
    const config = {
        headers: {
          "Content-Type": "application/json",
           Authorization: `key=hhhhh`,
        },
      };
      const body = {
        'notification': {
          'body': message, 
          'title': title, 
          'click_action': 'FLUTTER_NOTIFICATION_CLICK'
        },
        'priority': 'high',
        'data': {
          'click_action': 'FLUTTER_NOTIFICATION_CLICK',
          'id': '1',
          'body': 'body de prueba', 
          'status': 'done', 
          'type':type,
          'orderId':orderId
        },
        'to': deviceToken,
      }
      const { data } = await axios.post('https://fcm.googleapis.com/fcm/send',body, config)
      return data;
}


module.exports ={ sendNotification}