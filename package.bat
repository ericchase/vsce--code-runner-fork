cmd /c npm run build
pushd "package"
cmd /c npm install
vsce package
popd