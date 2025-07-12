##### ios 端运行可以 hot reload

### 本地调试 -c 清缓存

npx expo start --ios -c

### 本地调试 tunnel 模式

npx expo start --ios --tunnel

### 本地打包 android apk 格式

eas build --platform android --profile preview --local

### 远程更新

eas update --branch preview -m "远程更新"
