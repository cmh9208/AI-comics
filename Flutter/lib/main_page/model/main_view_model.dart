import 'package:ai_comics/main_page/component/firebase_auth_remote_data_source.dart';
import 'package:ai_comics/main_page/component/social_login.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:kakao_flutter_sdk_user/kakao_flutter_sdk_user.dart' as kakao;

class MainViewModel {
  final _firebaseAuthDataSource = FirebaseAuthRemoteDataSource();
  final SocialLogin _socialLogin;
  bool isLoggedIn = false;
  kakao.User? user;

  MainViewModel(this._socialLogin);

  Future login() async {
    isLoggedIn = await _socialLogin.login();
    if (isLoggedIn) {
      try {
        user = await kakao.UserApi.instance.me();
        final uid = user!.id.toString();
        final displayName = user!.kakaoAccount!.profile!.nickname;
        final email = user!.kakaoAccount!.email;
        final photoURL = user!.kakaoAccount!.profile!.profileImageUrl;

        final token = await _firebaseAuthDataSource.createCustomToken({
          'uid': uid,
          'displayName': displayName,
          'email': email ?? '',
          'photoURL': photoURL ?? '',
        });

        await FirebaseAuth.instance.signInWithCustomToken(token);
      } catch (e) {
        print(e);
      }
    }
  }

  Future logout() async {
    await _socialLogin.logout();
    await FirebaseAuth.instance.signOut();
    isLoggedIn = false;
    user = null;
  }
}
