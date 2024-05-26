cmd /c npm install
cmd /c npm run build
pushd "package"
cmd /c npm install
npx vsce package
popd