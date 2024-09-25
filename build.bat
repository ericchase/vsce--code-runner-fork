bun install
bun tsc -p ./
bun build.mts
pushd "build"
bun install
bunx vsce package
popd
