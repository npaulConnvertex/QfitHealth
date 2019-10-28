import { configureChannel } from './socketConnection';
import { AsyncStorage } from 'react-native';
import React, { Component } from 'react';
import { Socket } from 'phoenix';
import { createCustomerFromSocket, createEmployeeFromSocket, createServiceFromSocket, deleteCustomerFromSocket, deleteEmployeeFromSocket, createBusyBlockFromSocket, createAvailabilitySlotFromSocket, createAppointmentFromSocket, changeOpeningHoursFromSocket, deleteAppointmentFromSocket, deleteBusyBlockfromSocket, deleteAvailableSlotFromSocket } from "./actions/SocketAction";
import { createbusinessFromSocket } from './actions/CreateBusinessAction';
import store from "./store/index";

export class ChannelConnection {

  socket = null;
  channels = {};

  getData = async () => {
    try {
      var access_token = await AsyncStorage.multiGet(['access_token']);
      return access_token[0][1]
    } catch (e) {

    }

  }
  getUserData = async () => {
    try {
      var userSessionData = await AsyncStorage.multiGet(['session']);
      var sessionData = JSON.parse(userSessionData[0][1]);
      console.log("inside function => user id", (sessionData.user_id))
      return sessionData.user_id;
    } catch (e) { }
  }
  getID = async () => {
    var business_id = await AsyncStorage.getItem('business_id')
    return business_id;
  }
  connect = async () => {
    console.log("connect")
    socket = new Socket('wss://notifier.staging-qfit.me/socket', {
      logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data); }
    });
    socket.connect();

    socket.onOpen(event => console.log('Connected.'));
    socket.onError(event => console.log('Cannot connect.'))
    socket.onClose(event => console.log('Goodbye.'))
    // console.log("1st", asd)
  }

  disconnect = async () => {
    if (socket != null) {
      console.log("not null")
      socket.disconnect(() => console.log("Socket disconnected"));
      socket = null;
      channels = null;
    }
    else {
      console.log("null")
    }
  }

  connectChannel = async (name) => {
    let access_token = await this.getData();
    let business_id = await this.getID();
    let user_id = await this.getUserData();
    let channel = null;
    console.log("CONNECTTTTTTTT")
    console.log("name", name)
    if (name === 'business') {
      console.log("business channel connection")
      channel = socket.channel(`business:${business_id}`, { access_token: access_token });
      // channel = socket.channel(`user:${user_id}`, { access_token: access_token });
    }
    else if (name === 'user') {
      console.log("user channel connection")
      channel = socket.channel(`user:${user_id}`, { access_token: access_token });
      // channel = socket.channel(`business:${business_id}`, { access_token: access_token });
    }
    this.eventListener(channel);

    channel.join()
      .receive('ignore', () => console.log('Access denied.'))
      .receive('ok', () => console.log('Access granted.'))
      .receive('timeout', () => console.log('timeout.'))
    channels = { ...channels, [name]: channel }
  }

  eventListener = (channel) => {
    channel.on("create-business", msg => this.dispatchMessage(msg, createbusinessFromSocket));
    channel.on("create-customer", msg => this.dispatchMessage(msg, createCustomerFromSocket))
    channel.on("create-employee", msg => this.dispatchMessage(msg, createEmployeeFromSocket));
    channel.on("create-service", msg => this.dispatchMessage(msg, createServiceFromSocket));
    channel.on("delete-customer", msg => this.dispatchMessage(msg, deleteCustomerFromSocket));
    channel.on("delete-employee", msg => this.dispatchMessage(msg, deleteEmployeeFromSocket));
    channel.on("create-busy-block", msg => this.dispatchMessage(msg, createBusyBlockFromSocket))
    channel.on("create-availability-slot", msg => this.dispatchMessage(msg, createAvailabilitySlotFromSocket))
    channel.on("create-appointment", msg => this.dispatchMessage(msg, createAppointmentFromSocket))
    channel.on("change-opening-hours", msg => this.dispatchMessage(msg, changeOpeningHoursFromSocket))
    channel.on("delete-appointment", msg => this.dispatchMessage(msg, deleteAppointmentFromSocket))
    channel.on("delete-busy-block", msg => this.dispatchMessage(msg, deleteBusyBlockfromSocket))
    channel.on("delete-availability-slot", msg => this.dispatchMessage(msg, deleteAvailableSlotFromSocket))
  }

  dispatchMessage = (msg, target) => {
    console.log("deleteAppointment", msg)
    store.dispatch(target(msg))
  }

}

