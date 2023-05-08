
echo "Protogen is starting..."
mkdir "protogen"

echo $OSTYPE


# For windows and linux based OS, there are different methods for protogen
if [[ "$OSTYPE" == "msys" ]]; then
  protoc -I ./protos --plugin=protoc-gen-ts_proto=".\node_modules\.bin\protoc-gen-ts_proto.cmd" --ts_proto_out=./protogen ./protos/common/*.proto ./protos/sample/*.proto
else
  protoc -I ./protos --plugin=./node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=./protogen ./protos/common/*.proto ./protos/sample/*.proto
fi;

sleep 3
