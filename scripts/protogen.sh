#!/usr/bin/env bash

echo "Protogen is starting..."
mkdir "protogen"

echo $OSTYPE

PROTO_PATHS=(
  ./protos/common/*.proto
  ./protos/sample/*.proto
  ./protos/broker/sample/*.proto
  ./protos/broker/user/*.proto
)

# For windows and linux based OS, there are different methods for protogen
if [[ "$OSTYPE" == "msys" ]]; then
  protoc -I ./protos --plugin=protoc-gen-ts_proto=".\node_modules\.bin\protoc-gen-ts_proto.cmd" --ts_proto_out=./protogen "${PROTO_PATHS[@]}"
else
  protoc -I ./protos --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./protogen "${PROTO_PATHS[@]}"
fi;

sleep 3
