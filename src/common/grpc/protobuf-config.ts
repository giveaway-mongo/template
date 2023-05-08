import * as protobuf from 'protobufjs/minimal';

export const protobufConfigure = () => {
  protobuf.util.Long = undefined;
  protobuf.configure();
};
