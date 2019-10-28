import { Socket } from 'phoenix';


export function configureChannel() {
    let socket = new Socket('wss://notifier.staging-qfit.me/socket', {
    logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data); }
  });

  socket.connect();
  socket.onOpen(event => console.log('Connected.'));
  socket.onError(event => console.log('Cannot connect.'))
  socket.onClose(event => console.log('Goodbye.'))
 return socket;
};
