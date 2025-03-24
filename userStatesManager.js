// userStateManager.js
const fs = require('fs');

const userStatesFile = 'userStates.json';

class UserStateManager {
  constructor() {
    this.userStates = this.loadUserStates();
  }

  loadUserStates() {
    try {
      const data = fs.readFileSync(userStatesFile);
      return JSON.parse(data);
    } catch (error) {
      console.log('No se encontró el archivo userStates.json, se creará uno nuevo.');
      return {};
    }
  }

  saveUserStates() {
    fs.writeFileSync(userStatesFile, JSON.stringify(this.userStates, null, 2));
  }

  initializeUser(userId) {
    if (!this.userStates[userId]) {
      this.userStates[userId] = { state: 'initial', data: {} };
      this.saveUserStates();
    }
  }

  getUserState(userId) {
    return this.userStates[userId];
  }

  updateUserState(userId, state) {
    this.userStates[userId].state = state;
    this.saveUserStates();
  }

  updateUserData(userId, data) {
    this.userStates[userId].data = { ...this.userStates[userId].data, ...data };
    this.saveUserStates();
  }
}

module.exports = new UserStateManager();
