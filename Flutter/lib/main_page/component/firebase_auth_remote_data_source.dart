import 'package:http/http.dart' as http;

class FirebaseAuthRemoteDataSource {
  // 내 서버 url 삽입
  final String url = 'https://us-central1-ai-comics-7ce98.cloudfunctions.net/createCustomToken';
  //토큰 발급
  Future<String> createCustomToken(Map<String, dynamic> user) async {
    final customTokenResponse = await http
        .post(Uri.parse(url), body: user);

    return customTokenResponse.body;
  }
}
