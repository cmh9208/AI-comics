import 'package:flutter/material.dart';
import 'package:kakao_flutter_sdk_user/kakao_flutter_sdk_user.dart' as kakao;
import 'package:firebase_core/firebase_core.dart';
import './firebase_options.dart';
import 'main_page/screen/home_screen.dart';

void main() async {
  kakao.KakaoSdk.init(nativeAppKey: '239a9279935e1209399b8d68c4a015b9');
  WidgetsFlutterBinding.ensureInitialized();
  // 파이어 베이스 초기화
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const Home());
}

